'use strict';

// Массив для хранения карточек
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

// Переменные с классами элементов из html
const modalAdd = document.querySelector('.modal__add'),
    addAd =  document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add');

// Временные переменные
const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

// Получение всех элементов формы кроме кнопки
const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON' || elem.type !== 'submit');

// Объект для хранения фото
const infoPhoto = {};

// Отправка dataBase в localStorage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

// Проверка формы на заполнение
const checkForm = () => {
    const validForm =  elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
};

// Код для закрытия модальных окон
const closeModal = event => {
    const target = event.target;
    if (target.closest('.modal__close') ||
        target.classList.contains('modal') ||
        event.code === 'Escape') {
            modalAdd.classList.add('hide');
            modalItem.classList.add('hide');
            document.removeEventListener('keydown', closeModal);
            modalSubmit.reset();
            modalImageAdd.src = srcModalImage;
            modalFileBtn.textContent = textFileBtn;
            checkForm();
    }
};

// Вывод карточек товара
const renderCard = () => {
    catalog.textContent = '';
    dataBase.forEach((item, i) => {
        catalog.insertAdjacentHTML('beforeend', `
            <li class="card" data-id="${i}">
                <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>            
        `);
    });
};
// Формирование фото
modalFileInput.addEventListener('change', event => {
    const target = event.target;
    const reader = new FileReader();
    const file = target.files[0]; 
    infoPhoto.name = file.name;
    infoPhoto.size = file.size;
    reader.readAsBinaryString(file);
    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.name;
            infoPhoto.base64 = btoa(event.target.result); // Конвертация картинки в строку
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
        } else {
            modalFileBtn.textContent = 'Размер файла не должен превышать 200 кб';
            modalFileInput.value = '';
            checkForm();
        }
    });
});

// Проверка значений формы
modalSubmit.addEventListener('input', checkForm);

// Отправка значений формы в массив dataBase
modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    }
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    closeModal({ target: modalAdd });
    saveDB();
    renderCard();
});

// Открытие модального окна подачи объявления
addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);   
});

// Открытие модального окна товара
catalog.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('.card')) {
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

// Закрытие модальных окон при нажатии за границей модального окна или на крестик
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();



