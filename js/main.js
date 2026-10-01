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

    function closeMenu() {
        burger?.setAttribute('aria-expanded', 'false');
        menu?.classList.remove('is-open');
        document.body.classList.remove('menu-open');
    }

    burger?.addEventListener('click', () => {

        const isOpen =
            burger.getAttribute('aria-expanded') === 'true';

        burger.setAttribute(
            'aria-expanded',
            String(!isOpen)
        );

        menu?.classList.toggle('is-open', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
    });

    $$('#mobileMenu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
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

            link.classList.toggle(
                'is-active',
                link.getAttribute('href') === `#${current}` ||
                (
                    current === 'top' &&
                    link.getAttribute('href') === '#top'
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

        const observer = new IntersectionObserver(
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
            element.classList.add('is-visible');
        });

    }


    /* =========================================
       ECOBLOCK CALCULATOR
       ========================================= */

    const calculator = $('.calculator');

    if (calculator) {

        const wallLength = calculator.querySelector(
            'input[name="wall_length"]'
        );

        const wallHeight = calculator.querySelector(
            'input[name="wall_height"]'
        );

        const blockArea = calculator.querySelector(
            'input[name="block_area"]'
        );

        const result = calculator.querySelector(
            '.t-calc__result'
        );

        const hiddenResult = calculator.querySelector(
            '.t-calc__hiddeninput'
        );


        /* -----------------------------------------
           Check calculator elements
           ----------------------------------------- */

        if (
            wallLength &&
            wallHeight &&
            blockArea &&
            result
        ) {


            /* -----------------------------------------
               Calculate
               ----------------------------------------- */

            function calculate() {

                const length =
                    parseFloat(
                        wallLength.value.replace(',', '.')
                    ) || 0;

                const height =
                    parseFloat(
                        wallHeight.value.replace(',', '.')
                    ) || 0;

                const area =
                    parseFloat(
                        blockArea.value.replace(',', '.')
                    ) || 0;


                /* Prevent invalid calculation */

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
                   Formula

                   Длина × Высота ÷ Площадь блока
                   ----------------------------------------- */

                const calculated =
                    length * height / area;


                /* -----------------------------------------
                   Round UP

                   Example:
                   230.2 → 231
                   ----------------------------------------- */

                const blocks = Math.ceil(
                    calculated
                );


                /* -----------------------------------------
                   Display
                   ----------------------------------------- */

                result.textContent =
                    blocks.toLocaleString('ru-RU');


                /* Hidden result */

                if (hiddenResult) {
                    hiddenResult.value = blocks;
                }

            }


            /* -----------------------------------------
               Events
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
               Initial calculation
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

    const cf = $('#contactForm');
    const status = $('#formStatus');

    cf?.addEventListener('submit', e => {

        e.preventDefault();

        const name =
            cf.elements.name?.value.trim() || '';

        const phone =
            cf.elements.phone?.value.trim() || '';


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


        if (status) {
            status.textContent =
                'Заявка заполнена. Подключите здесь реальную отправку формы.';
        }

    });


    /* =========================================
       BACK TO TOP
       ========================================= */

    const top = $('#toTop');

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
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('contactForm');
        const statusDiv = document.getElementById('formStatus');

        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = new FormData(form);
                const submitBtn = form.querySelector('button[type="submit"]');

                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';

                fetch('mail.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        return response.text().then(text => {
                            if (response.ok) {
                                statusDiv.style.color = '#a8e6cf';
                                statusDiv.textContent = text;
                                form.reset();
                            } else {
                                statusDiv.style.color = '#ff8b94';
                                statusDiv.textContent = text || 'Произошла ошибка.';
                            }
                        });
                    })
                    .catch(error => {
                        statusDiv.style.color = '#ff8b94';
                        statusDiv.textContent = 'Ошибка сети. Попробуйте позже.';
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Отправить';
                    });
            });
        }
    });
})();