'use strict';

const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    modalItem = document.querySelector('.modal__item'),
    catalog = document.querySelector('.catalog');

/*открытие модальной формы ввода объявления */
addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
});

/* закрытие формы */
modalAdd.addEventListener('click', event => {
    const target = event.target;

    if (target.classList.contains('modal__close') ||
        target === modalAdd) {
        modalAdd.classList.add('hide');
        modalSubmit.reset();
    }

});

/*вызов модальной формы карточки товара */
catalog.addEventListener('click', event => {
    if (event.target.closest('.catalog')) {
        modalItem.classList.remove('hide');
    }
});

/* закрытие карточки объявления */
modalItem.addEventListener('click', event => {
    const target = event.target;

    if (target.classList.contains('modal__close') ||
        target === modalItem) {
        modalItem.classList.add('hide');
    }
});

/* обработка нажатия клавиши ESC */
document.addEventListener('keydown', event => {

    if (event.keyCode === 27) {
        modalItem.classList.add('hide');
        modalAdd.classList.add('hide');
        modalSubmit.reset();
    }

})