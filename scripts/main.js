'use strict';

// Массив для хранения карточек
 const dataBase = [];

 // Переменные с классами элементов из html
 const modalAdd = document.querySelector('.modal__add'),
    addAd =  document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning');

//Получение всех элементов формы кроме кнопки
 const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON' || elem.type !== 'submit');

 //Открытие модального окна подачи объявления(и отключение кнопки "Отправить")
addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);   
    document.addEventListener('keydown', closeModal);
});

//Открытие модального окна товара
catalog.addEventListener('click', e => {
    const target = e.target;
    if (target.closest('.card')){
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

//Код для закрытия модальных окон
const closeModal = function (e) {
    const target = e.target;

    if (target.closest(".modal__close") || target === this) {
        this.classList.add('hide');
        if (this === modalAdd) {
            modalSubmit.reset();
        }
    } else if (e.code === 'Escape') {
        modalItem.classList.add('hide');
        modalAdd.classList.add('hide');
        modalSubmit.reset();
    }
};

//Закрытие модальных окон при нажатии за границей модального окна или на крестик
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

//Закрытие формы при нажатии "Отправить"
modalBtnSubmit.addEventListener('click', () => {modalAdd.classList.add('hide')});

//Проверка значений формы
modalSubmit.addEventListener('input', () => {
    const validForm =  elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
});

//Отправка значений формы в массив dataBase
modalSubmit.addEventListener('submit', e => {
    const itemObj = {};
    e.preventDefault();
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    dataBase.push(itemObj);
    modalSubmit.reset();
});