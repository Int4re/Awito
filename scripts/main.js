// Массив для хранения карточек
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

// Счетчик
let counter = dataBase.length;

// Переменные с классами элементов из html
const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');

// Получение элементов для модального окна
const modalImageItem = document.querySelector('.modal__image-item');
const modalHeaderItem = document.querySelector('.modal__header-item');
const modalStatusItem = document.querySelector('.modal__status-item');
const modalDescriptionItem = document.querySelector('.modal__description-item');
const modalCostItem = document.querySelector('.modal__cost-item');

// Переменные для реализации поиска
const searchInput = document.querySelector('.search__input');
const menuContainer = document.querySelector('.menu__container');

// Временные переменные
const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

// Получение всех элементов формы кроме кнопки
const elementsModalSubmit = [...modalSubmit.elements].filter(
  (elem) => elem.tagName !== 'BUTTON' && elem.type !== 'submit',
);

// Объект для хранения фото
const infoPhoto = {};

// Отправка dataBase в localStorage
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

// Проверка формы на заполнение
const checkForm = () => {
  const validForm = elementsModalSubmit.every((elem) => elem.value);
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? 'none' : '';
};

// Код для закрытия модальных окон
const closeModal = (event) => {
  const { target } = event;
  if (target.closest('.modal__close')
    || target.classList.contains('modal')
    || event.code === 'Escape') {
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
const renderCard = (DB = dataBase) => {
  catalog.textContent = '';
  DB.forEach((item) => {
    catalog.insertAdjacentHTML('beforeend', `
      <li class = "card" data-id-item="${item.counter}">
        <img class = "card__image" src = "data:image/jpeg;base64,${item.image}" alt = "test"/>
        <div class = "card__description">
          <h3 class = "card__header" >${item.nameItem}</h3>
          <div class = "card__price" >${item.costItem}₽</div>
        </div>
      </li>
      `);
  });
};

// Реализация поиска
searchInput.addEventListener('input', () => {
  const valueSearch = searchInput.value.trim().toLowerCase();
  if (valueSearch.length > 2) {
    const result = dataBase.filter((item) => item.nameItem.toLowerCase().includes(valueSearch)
      || item.descriptionItem.toLowerCase().includes(valueSearch));
    renderCard(result);
  }
});

// Формирование фото
modalFileInput.addEventListener('change', (event) => {
  const { target } = event;
  const reader = new FileReader();
  const file = target.files[0];
  infoPhoto.filename = file.name;
  infoPhoto.size = file.size;
  reader.readAsBinaryString(file);
  reader.addEventListener('load', (e) => {
    if (infoPhoto.size < 200000) {
      modalFileBtn.textContent = infoPhoto.filename;
      infoPhoto.base64 = btoa(e.target.result);
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
modalSubmit.addEventListener('submit', (event) => {
  event.preventDefault();
  const itemObj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  // eslint-disable-next-line no-plusplus
  itemObj.counter = counter++;
  itemObj.image = infoPhoto.base64;
  dataBase.push(itemObj);
  closeModal({
    target: modalAdd,
  });
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
catalog.addEventListener('click', (event) => {
  const { target } = event;
  const card = target.closest('.card');

  if (card) {
    console.log(card.dataset);
    const item = dataBase.find((obj) => obj.counter === +card.dataset.idItem);
    modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
    modalHeaderItem.textContent = item.nameItem;
    modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
    modalDescriptionItem.textContent = item.descriptionItem;
    modalCostItem.textContent = item.costItem;
    modalItem.classList.remove('hide');
    document.addEventListener('keydown', closeModal);
  }
});

// Фильтрация по категориям
menuContainer.addEventListener('click', (event) => {
  const { target } = event;

  if (target.tagName === 'A') {
    const result = dataBase.filter((item) => item.category === target.dataset.category);
    renderCard(result);
  }
});

// Закрытие модальных окон при нажатии за границей модального окна или на крестик
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();
