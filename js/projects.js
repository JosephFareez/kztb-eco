document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox__close');

    if (!lightbox || !lightboxImg) return;

    // Открытие фото при клике на любой элемент галереи
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.photo-item img');
        if (item) {
            lightboxImg.src = item.src;
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
        }
    });

    // Функция закрытия
    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = ''; // Возвращаем прокрутку
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    // Закрытие по крестику
    closeBtn?.addEventListener('click', closeLightbox);

    // Закрытие при клике по фону (мимо самой картинки)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Закрытие по клавише Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
});