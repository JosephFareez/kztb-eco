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

        const clickedInsideMenu =
            menu.contains(e.target);

        const clickedBurger =
            burger.contains(e.target);

        if (
            menu.classList.contains('is-open') &&
            !clickedInsideMenu &&
            !clickedBurger
        ) {
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

            const href =
                link.getAttribute('href');

            link.classList.toggle(
                'is-active',
                href === `#${current}` ||
                (
                    current === 'top' &&
                    href === '#top'
                )
            );

        });

    }


    addEventListener(
        'scroll',
        updateActiveNav,
        {passive: true}
    );


    updateActiveNav();


    /* =========================================
       SCROLL REVEAL
       ========================================= */

    const reveal = $$('.reveal');


    if ('IntersectionObserver' in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                'is-visible'
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        reveal.forEach(element => {

            observer.observe(element);

        });


    } else {

        reveal.forEach(element => {

            element.classList.add(
                'is-visible'
            );

        });

    }


    /* =========================================
       ECOBLOCK CALCULATOR
       ========================================= */

    const calculator = $('.calculator');


    if (calculator) {

        const wallLength =
            calculator.querySelector(
                'input[name="wall_length"]'
            );

        const wallHeight =
            calculator.querySelector(
                'input[name="wall_height"]'
            );

        const blockArea =
            calculator.querySelector(
                'input[name="block_area"]'
            );

        const result =
            calculator.querySelector(
                '.t-calc__result'
            );

        const hiddenResult =
            calculator.querySelector(
                '.t-calc__hiddeninput'
            );


        /* -----------------------------------------
           CHECK CALCULATOR ELEMENTS
           ----------------------------------------- */

        if (
            wallLength &&
            wallHeight &&
            blockArea &&
            result
        ) {


            /* -----------------------------------------
               CALCULATE
               ----------------------------------------- */

            function calculate() {

                const length =
                    parseFloat(
                        wallLength.value
                            .replace(',', '.')
                    ) || 0;


                const height =
                    parseFloat(
                        wallHeight.value
                            .replace(',', '.')
                    ) || 0;


                const area =
                    parseFloat(
                        blockArea.value
                            .replace(',', '.')
                    ) || 0;


                /* -----------------------------------------
                   INVALID VALUES
                   ----------------------------------------- */

                if (
                    length <= 0 ||
                    height <= 0 ||
                    area <= 0
                ) {

                    result.textContent = '0';


                    if (hiddenResult) {

                        hiddenResult.value = '0';

                    }


                    return;

                }


                /* -----------------------------------------
                   FORMULA

                   Длина × Высота ÷ Площадь блока
                   ----------------------------------------- */

                const calculated =
                    length * height / area;


                /* -----------------------------------------
                   ROUND UP

                   230.2 → 231
                   ----------------------------------------- */

                const blocks =
                    Math.ceil(calculated);


                /* -----------------------------------------
                   DISPLAY RESULT
                   ----------------------------------------- */

                result.textContent =
                    blocks.toLocaleString('ru-RU');


                /* Hidden result */

                if (hiddenResult) {

                    hiddenResult.value =
                        blocks;

                }

            }


            /* -----------------------------------------
               INPUT EVENTS
               ----------------------------------------- */

            [
                wallLength,
                wallHeight,
                blockArea

            ].forEach(input => {

                input.addEventListener(
                    'input',
                    calculate
                );


                input.addEventListener(
                    'change',
                    calculate
                );

            });


            /* -----------------------------------------
               INITIAL CALCULATION
               ----------------------------------------- */

            calculate();


        } else {

            console.error(
                'Calculator: required elements not found.'
            );

        }

    }


    /* =========================================
       CONTACT FORM
       ========================================= */

    const cf =
        $('#contactForm');

    const status =
        $('#formStatus');


    cf?.addEventListener(
        'submit',
        e => {

            e.preventDefault();


            const name =
                cf.elements.name?.value.trim() || '';


            const phone =
                cf.elements.phone?.value.trim() || '';


            /* -----------------------------------------
               VALIDATION
               ----------------------------------------- */

            if (
                !name ||
                phone.length < 10
            ) {

                if (status) {

                    status.textContent =
                        'Проверьте имя и телефон.';

                }

                return;

            }


            /* -----------------------------------------
               SEND FORM
               ----------------------------------------- */

            const formData =
                new FormData(cf);


            const submitBtn =
                cf.querySelector(
                    'button[type="submit"]'
                );


            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.textContent =
                    'Отправка...';

            }


            fetch('mail.php', {

                method: 'POST',

                body: formData

            })

                .then(response => {

                    return response.text()
                        .then(text => {

                            if (response.ok) {

                                if (status) {

                                    status.style.color =
                                        '#a8e6cf';

                                    status.textContent =
                                        text;

                                }


                                cf.reset();


                            } else {

                                if (status) {

                                    status.style.color =
                                        '#ff8b94';

                                    status.textContent =
                                        text ||
                                        'Произошла ошибка.';

                                }

                            }

                        });

                })


                .catch(() => {

                    if (status) {

                        status.style.color =
                            '#ff8b94';

                        status.textContent =
                            'Ошибка сети. Попробуйте позже.';

                    }

                })


                .finally(() => {

                    if (submitBtn) {

                        submitBtn.disabled = false;

                        submitBtn.textContent =
                            'Отправить';

                    }

                });

        }
    );


    /* =========================================
       BACK TO TOP
       ========================================= */

    const top =
        $('#toTop');


    addEventListener(
        'scroll',
        () => {

            top?.classList.toggle(
                'is-visible',
                scrollY > 600
            );

        },
        {passive: true}
    );


    top?.addEventListener(
        'click',
        () => {

            scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


})();