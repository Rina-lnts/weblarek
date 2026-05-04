import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';

import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types';

const events = new EventEmitter();

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const modalElement = ensureElement<HTMLElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Представления создаются один раз
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(modalElement, events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);

// 1. Каталог загружен — карточки создаются с колбэком
events.on('catalog:changed', () => {
  const cards = productsModel.getItems().map(item => {
    const card = new CardCatalog(
      cloneTemplate(cardCatalogTemplate),
      () => productsModel.setPreview(item)
    );
    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: CDN_URL + item.image,
    });
  });
  gallery.catalog = cards;
});

// 2. Превью изменилось — показываем модальное окно
events.on('preview:changed', ({ item }: { item: IProduct }) => {
  cardPreview.inBasket = basketModel.hasItem(item.id);
  modal.content = cardPreview.render({
    title: item.title,
    price: item.price,
    category: item.category,
    image: CDN_URL + item.image,
    description: item.description,
  });
  modal.open();
});

// 3. Купить / удалить из корзины — берём товар из модели, не из события
events.on('card:buy', () => {
  const item = productsModel.getPreview();
  if (!item) return;
  if (basketModel.hasItem(item.id)) {
    basketModel.removeItem(item.id);
  } else {
    basketModel.addItem(item);
  }
  modal.close();
});

// 4. Корзина изменилась — обновляем счётчик и перерисовываем содержимое
events.on('basket:changed', () => {
  header.counter = basketModel.getCount();

  const cards = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(
      cloneTemplate(cardBasketTemplate),
      () => basketModel.removeItem(item.id)
    );
    card.index = index + 1;
    return card.render({
      title: item.title,
      price: item.price,
    });
  });

  basketView.items = cards;
  basketView.total = basketModel.getTotalPrice();
});

// 5. Открытие корзины
events.on('basket:open', () => {
  modal.content = basketView.render();
  modal.open();
});

// 6. Открытие первой формы
events.on('order:open', () => {
  modal.content = orderForm.render();
  modal.open();
});

// 7. Выбор способа оплаты
events.on('payment:select', ({ payment }: { payment: string }) => {
  buyerModel.setField('payment', payment);
});

// 8. Изменение полей формы
events.on('form:change', ({ field, value }: { field: string; value: string }) => {
  buyerModel.setField(field as keyof ReturnType<typeof buyerModel.getData>, value);
});

// 9. Данные покупателя изменились — обновляем формы через сеттеры
events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const data = buyerModel.getData();
  
  orderForm.payment = data.payment ?? '';
  orderForm.address = data.address;
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = [errors.payment, errors.address].filter(Boolean).join(', ');

  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join(', ');
});

// 10. Сабмит первой формы — открываем вторую
events.on('order:submit', () => {
  modal.content = contactsForm.render();
});

// 11. Сабмит второй формы — отправляем заказ
events.on('contacts:submit', () => {
  const data = buyerModel.getData();
  const items = basketModel.getItems().map(item => item.id);
  const total = basketModel.getTotalPrice();

  larekApi.createOrder({ ...data, items, total })
    .then(response => {
      basketModel.clear();
      buyerModel.clear();
      successView.total = response.total;
      modal.content = successView.render();
    })
    .catch(err => console.error('Ошибка оформления заказа:', err));
});

// 12. Закрытие экрана успеха
events.on('success:close', () => {
  modal.close();
});

// Загрузка товаров с сервера
larekApi.getProducts()
  .then(data => {
    productsModel.setItems(data.items);
  })
  .catch(err => console.error('Ошибка загрузки товаров:', err));