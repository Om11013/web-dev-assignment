document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    let triggerHeight = window.innerHeight;
    let lastScrollTop = 0;

    // Sticky Header & Scroll Logic
    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY || document.documentElement.scrollTop;
        
        if (currentScroll > triggerHeight) {
            header.classList.add('is-sticky');
            
            if (currentScroll > lastScrollTop) {
                header.classList.add('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }
        } else {
            header.classList.remove('is-sticky');
            header.classList.remove('is-hidden');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    window.addEventListener('resize', () => {
        triggerHeight = window.innerHeight;
    });

    // Image Carousel Zoom functionality
    const mainImageContainer = document.getElementById('main-image-container');
    const mainImage = document.getElementById('main-image');

    if (mainImageContainer && mainImage) {
        mainImageContainer.addEventListener('mousemove', (e) => {
            const rect = mainImageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            mainImage.style.transform = `scale(1.8)`; 
        });

        mainImageContainer.addEventListener('mouseleave', () => {
            mainImage.style.transformOrigin = `center center`;
            mainImage.style.transform = `scale(1)`;
        });
    }

    // Carousel Image Navigation
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentIndex = 0;
    const totalItems = thumbnails.length;

    function updateCarousel(index) {
        thumbnails.forEach(th => th.classList.remove('active'));
        thumbnails[index].classList.add('active');
    }

    if (thumbnails.length > 0) {
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel(currentIndex);
            });
        });

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === 0) ? totalItems - 1 : currentIndex - 1;
                updateCarousel(currentIndex);
            });
            
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
                updateCarousel(currentIndex);
            });
        }
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(faq => faq.classList.remove('active'));
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Shared Carousel Scroll Utility
    const initOffsetCarousel = (carouselId, cardClass) => {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const getScrollAmount = () => {
            const card = carousel.querySelector(`.${cardClass}`);
            if (card) {
                const gap = parseInt(window.getComputedStyle(carousel).gap) || 24;
                return card.offsetWidth + gap;
            }
            return 300;
        };

        setTimeout(() => {
            if (window.innerWidth >= 1024) {
                const gap = parseInt(window.getComputedStyle(carousel).gap) || 24;
                const card = carousel.querySelector(`.${cardClass}`);
                if (card) {
                    const cardWidth = card.offsetWidth;
                    const containerWidth = carousel.offsetWidth;
                    const center2CardsWidth = 2 * cardWidth + gap;
                    const remainder = containerWidth - center2CardsWidth;
                    const visibleOuterCard = (remainder - 2 * gap) / 2;
                    const targetScroll = cardWidth - visibleOuterCard;

                    carousel.style.scrollBehavior = 'auto';
                    carousel.scrollLeft = targetScroll;
                    carousel.offsetHeight; 
                    carousel.style.scrollBehavior = 'smooth';
                }
            }
        }, 150);

        const prevBtn = carousel.parentElement.querySelector('[class$="-prev"]');
        const nextBtn = carousel.parentElement.querySelector('[class$="-next"]');

        if (prevBtn) prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
        if (nextBtn) nextBtn.addEventListener('click', () => carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
    };

    initOffsetCarousel('apps-carousel', 'app-card');
    initOffsetCarousel('reviews-carousel', 'review-card');

    // Modals
    const setupModal = (btnSelector, modalId, closeBtnId) => {
        const btn = document.querySelector(btnSelector);
        const modal = document.getElementById(modalId);
        if (!btn || !modal) return;

        const closeBtn = document.getElementById(closeBtnId);
        const openModal = (e) => {
            if (e) e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        btn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    };

    setupModal('.tech-specs-section .btn-outline-white', 'download-modal', 'modal-close-btn');
    setupModal('.btn-quote', 'quote-modal', 'quote-modal-close-btn');
});
