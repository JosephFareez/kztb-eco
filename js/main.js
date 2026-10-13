(() => {
    'use strict';

    /* =========================================
       HELPERS
       ========================================= */

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];


    /* =========================================
       MOBILE MENU
       ========================================= */

    const burger = $('.burger');
    const menu = $('#mobileMenu');

    function openMenu() {

        if (!burger || !menu) return;

        burger.setAttribute('aria-expanded', 'true');

        menu.classList.add('is-open');

        document.body.classList.add('menu-open');
    }


    function closeMenu() {

        if (!burger || !menu) return;

        burger.setAttribute('aria-expanded', 'false');

        menu.classList.remove('is-open');

        document.body.classList.remove('menu-open');
    }


    function toggleMenu() {

        if (!burger || !menu) return;

        const isOpen =
            burger.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }


    /* Burger click */

    burger?.addEventListener('click', toggleMenu);


    /* Close menu when clicking a link */

    $$('#mobileMenu a').forEach(link => {

        link.addEventListener('click', () => {
            closeMenu();
        });

    });

    /* Close menu with ESC */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', e => {
        if (!menu || !burger) return;
        const clickedInsideMenu = menu.contains(e.target);
        const clickedBurger = burger.contains(e.target);
        if (menu.classList.contains('is-open') && !clickedInsideMenu && !clickedBurger) {
            closeMenu();
        }
    });


    /* =========================================
       ACTIVE NAVIGATION
       ========================================= */

    const nav = $$('.nav a');
    const sections = $$('main section[id]');

    function updateActiveNav() {
        let current = 'top';
        const y = scrollY + 130;

        sections.forEach(section => {
            if (y >= section.offsetTop) {
                current = section.id;
            }
        });

        nav.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle(
                'is-active',
                href === `#${current}` ||
                (current === 'top' && href === '#top')
            );
        });
    }

    addEventListener('scroll', updateActiveNav, {passive: true});
    updateActiveNav();


    /* =========================================
       SCROLL REVEAL
       ========================================= */

    const reveal = $$('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {threshold: 0.12}
        );

        reveal.forEach(element => {
            observer.observe(element);
        });
    } else {
        reveal.forEach(element => {
            element.classList.add('is-visible');
        });
    }


    /* =========================================
       ECOBLOCK CALCULATOR
       ========================================= */

    const calculator = $('.calculator');

    if (calculator) {
        const wallLength = calculator.querySelector('input[name="wall_length"]');
        const wallHeight = calculator.querySelector('input[name="wall_height"]');
        const blockArea = calculator.querySelector('input[name="block_area"]');
        const result = calculator.querySelector('.t-calc__result');
        const hiddenResult = calculator.querySelector('.t-calc__hiddeninput');

        if (wallLength && wallHeight && blockArea && result) {

            function calculate() {
                const length = parseFloat(wallLength.value.replace(',', '.')) || 0;
                const height = parseFloat(wallHeight.value.replace(',', '.')) || 0;
                const area = parseFloat(blockArea.value.replace(',', '.')) || 0;

                if (length <= 0 || height <= 0 || area <= 0) {
                    result.textContent = '0';
                    if (hiddenResult) hiddenResult.value = '0';
                    return;
                }

                const calculated = length * height / area;
                const blocks = Math.ceil(calculated);

                result.textContent = blocks.toLocaleString('ru-RU');
                if (hiddenResult) hiddenResult.value = blocks;
            }

            [wallLength, wallHeight, blockArea].forEach(input => {
                input.addEventListener('input', calculate);
                input.addEventListener('change', calculate);
            });

            calculate();
        } else {
            console.error('Calculator: required elements not found.');
        }
    }


    /* =========================================
       CONTACT FORM
       ========================================= */

    const cf = $('#contactForm');
    const status = $('#formStatus');

    cf?.addEventListener('submit', e => {
        e.preventDefault();

        const name = cf.elements.name?.value.trim() || '';
        const phone = cf.elements.phone?.value.trim() || '';

        if (!name || phone.length < 10) {
            if (status) status.textContent = 'Проверьте имя и телефон.';
            return;
        }

        const formData = new FormData(cf);
        const submitBtn = cf.querySelector('button[type="submit"]');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
        }

        fetch('mail.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                return response.text().then(text => {
                    if (response.ok) {
                        if (status) {
                            status.style.color = '#a8e6cf';
                            status.textContent = text;
                        }
                        cf.reset();
                    } else {
                        if (status) {
                            status.style.color = '#ff8b94';
                            status.textContent = text || 'Произошла ошибка.';
                        }
                    }
                });
            })
            .catch(() => {
                if (status) {
                    status.style.color = '#ff8b94';
                    status.textContent = 'Ошибка сети. Попробуйте позже.';
                }
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Отправить';
                }
            });
    });


    /* =========================================
       BACK TO TOP
       ========================================= */

    const top = $('#toTop');

    addEventListener('scroll', () => {
        top?.classList.toggle('is-visible', scrollY > 600);
    }, {passive: true});

    top?.addEventListener('click', () => {
        scrollTo({top: 0, behavior: 'smooth'});
    });


    /* =========================================
       LIGHTBOX (УВЕЛИЧЕНИЕ ФОТО)
       ========================================= */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox__close');

    if (lightbox && lightboxImg) {

        // Changed to look for the outer .photo-item wrapper so padding clicks work
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.photo-item');
            if (item) {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('is-open');
                    document.body.style.overflow = 'hidden';
                }
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';

            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
                closeLightbox();
            }
        });
    }

    /* =========================================================
       PROJECTS MODAL (МОДАЛЬНОЕ ОКНО КАТАЛОГА ДОМОВ)
       ========================================================= */
    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
        const modalOverlay = document.getElementById('projectModalOverlay');
        const modalCloseBtn = projectModal.querySelector('.project-modal__close');

        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalMainImg = document.getElementById('modalMainImg');
        const modalThumbs = document.getElementById('modalThumbs');

        const projectCards = document.querySelectorAll('.project[data-project]');
        projectCards.forEach(card => {
            card.addEventListener('click', function () {
                const data = JSON.parse(this.getAttribute('data-project'));

                modalTitle.textContent = data.title;
                modalDesc.innerHTML = data.description;
                modalMainImg.src = data.mainImage;

                modalThumbs.innerHTML = '';
                if (data.thumbnails && data.thumbnails.length > 0) {
                    data.thumbnails.forEach((thumbSrc, index) => {
                        const imgEl = document.createElement('img');
                        imgEl.src = thumbSrc;
                        if (index === 0) imgEl.classList.add('active');

                        imgEl.addEventListener('click', function () {
                            modalMainImg.src = this.src;
                            modalThumbs.querySelectorAll('img').forEach(img => img.classList.remove('active'));
                            this.classList.add('active');
                        });

                        modalThumbs.appendChild(imgEl);
                    });
                }

                projectModal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeProjectModal() {
            projectModal.classList.remove('is-open');
            document.body.style.overflow = '';

            setTimeout(() => {
                modalMainImg.src = '';
                modalThumbs.innerHTML = '';
            }, 300);
        }

        modalCloseBtn.addEventListener('click', closeProjectModal);
        modalOverlay.addEventListener('click', closeProjectModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('is-open')) {
                closeProjectModal();
            }
        });
    }

    /* =========================================================
       POPUP ФОРМА КОНТАКТОВ (ПОВЕРХ ПРОЕКТОВ)
       ========================================================= */
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        const btnProjectContact = document.getElementById('btnProjectContact');
        const contactModalOverlay = document.getElementById('contactModalOverlay');
        const contactModalClose = contactModal.querySelector('.contact-modal__close');

        const popupProjectName = document.getElementById('popupProjectName');
        const modalTitleElement = document.getElementById('modalTitle');

        if (btnProjectContact) {
            btnProjectContact.addEventListener('click', () => {
                if (popupProjectName && modalTitleElement) {
                    popupProjectName.value = modalTitleElement.textContent;
                }
                contactModal.classList.add('is-open');
            });
        }

        function closeContactModal() {
            contactModal.classList.remove('is-open');
        }

        contactModalClose.addEventListener('click', closeContactModal);
        contactModalOverlay.addEventListener('click', closeContactModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('is-open')) {
                closeContactModal();
            }
        });

        const popupForm = document.getElementById('popupContactForm');
        const popupStatus = document.getElementById('popupFormStatus');

        if (popupForm) {
            popupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = popupForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';

                fetch('mail.php', {
                    method: 'POST',
                    body: new FormData(popupForm)
                })
                    .then(response => response.text().then(text => {
                        if (response.ok) {
                            if (popupStatus) {
                                popupStatus.style.color = '#a8e6cf';
                                popupStatus.textContent = 'Спасибо! Заявка отправлена.';
                            }
                            popupForm.reset();
                            setTimeout(closeContactModal, 2000);
                        } else {
                            if (popupStatus) {
                                popupStatus.style.color = '#ff8b94';
                                popupStatus.textContent = text || 'Произошла ошибка.';
                            }
                        }
                    }))
                    .catch(() => {
                        if (popupStatus) {
                            popupStatus.style.color = '#ff8b94';
                            popupStatus.textContent = 'Ошибка сети. Попробуйте позже.';
                        }
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Отправить';
                    });
            });
        }
    }
})();