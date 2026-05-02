import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';

// Модели
import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

// Представления
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog, CardPreview, CardBasket } from './components/View/Card';
import { Basket } from './components/View/Basket';
import { OrderForm, ContactsForm } from './components/View/Form';
import { Success } from './components/View/Success';

import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types';

// ─── Инициализация ──────────────────────────────────────────────────────────

const events = new EventEmitter();

// Модели данных
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// API
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Корневые DOM-элементы
const pageElement = ensureElement<HTMLElement>('.page__wrapper');
const modalElement = ensureElement<HTMLElement>('#modal-container');

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты представления
const page = new Page(pageElement, events);
const modal = new Modal(modalElement, events);

// ─── Обработчики событий (Презентер) ────────────────────────────────────────

// 1. Каталог товаров загружен — отрисовываем карточки
events.on('catalog:changed', () => {
  const cards = productsModel.getItems().map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    const element = card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: CDN_URL + item.image,
    });
    // Сохраняем id товара в dataset для передачи в событии
    element.dataset.id = item.id;
    return element;
  });
  page.catalog = cards;
});

// 2. Пользователь кликнул на карточку в каталоге — открываем превью
events.on('card:select', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id);
  if (item) productsModel.setPreview(item);
});

// 3. Данные превью изменились — показываем модальное окно с детальной карточкой
events.on('preview:changed', ({ item }: { item: IProduct }) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
  const inBasket = basketModel.hasItem(item.id);
  card.inBasket = inBasket;
  const element = card.render({
  title: item.title,
  price: item.price,
  category: item.category,
  image: CDN_URL + item.image,
  description: item.description,
});
  element.dataset.id = item.id;
  modal.content = element;
  modal.open();
});

// 4. Пользователь нажал кнопку «Купить» / «Удалить из корзины»
events.on('card:buy', ({ id, inBasket }: { id: string; inBasket: boolean }) => {
  const item = productsModel.getItemById(id);
  if (!item) return;

  if (inBasket) {
    basketModel.removeItem(id);
  } else {
    basketModel.addItem(item);
  }
  // Закрываем модальное окно после действия
  modal.close();
});

// 5. Корзина изменилась — обновляем счётчик в шапке
events.on('basket:changed', () => {
  page.counter = basketModel.getCount();
});

// 6. Пользователь открыл корзину
events.on('basket:open', () => {
  const basket = new Basket(cloneTemplate(basketTemplate), events);

  const cards = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
    card.index = index + 1;
  const element = card.render({
  title: item.title,
  price: item.price,
  });
    element.dataset.id = item.id;
    return element;
  });

  const element = basket.render({
    items: cards,
    total: basketModel.getTotalPrice(),
  });

  modal.content = element;
  modal.open();
});

// 7. Пользователь удалил товар из корзины
events.on('basket:remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
  // Переоткрываем корзину, чтобы обновить список
  events.emit('basket:open');
});

// 8. Пользователь нажал «Оформить» — открываем первую форму
events.on('order:open', () => {
  const form = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
  const element = form.render({ valid: false, errors: '' });
  modal.content = element;
  modal.open();
});

// 9. Пользователь выбрал способ оплаты
events.on('payment:select', ({ payment }: { payment: string }) => {
  buyerModel.setField('payment', payment);
});

// 10. Пользователь вводит данные в любую форму
events.on('form:change', ({ field, value }: { field: string; value: string }) => {
  buyerModel.setField(field as keyof typeof buyerModel.getData extends Function ? never : string, value);
});

// 11. Данные покупателя изменились — валидируем форму и обновляем UI
events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const data = buyerModel.getData();

  // Определяем, какая форма сейчас открыта, по наличию в DOM
  const orderForm = modalElement.querySelector<HTMLFormElement>('form[name=order]');
  const contactsForm = modalElement.querySelector<HTMLFormElement>('form[name=contacts]');

  if (orderForm) {
    const form = new OrderForm(orderForm, events);
    form.payment = data.payment ?? '';
    form.valid = !errors.payment && !errors.address;
    form.errors = [errors.payment, errors.address].filter(Boolean).join(', ');
  }

  if (contactsForm) {
    const form = new ContactsForm(contactsForm, events);
    form.valid = !errors.email && !errors.phone;
    form.errors = [errors.email, errors.phone].filter(Boolean).join(', ');
  }
});

// 12. Первая форма отправлена — переходим ко второй
events.on('order:submit', () => {
  const form = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
  const element = form.render({ valid: false, errors: '' });
  modal.content = element;
});

// 13. Вторая форма отправлена — отправляем заказ на сервер
events.on('contacts:submit', () => {
  const data = buyerModel.getData();
  const items = basketModel.getItems().map(item => item.id);
  const total = basketModel.getTotalPrice();

  larekApi.createOrder({
    ...data,
    items,
    total,
  })
    .then(response => {
      // Очищаем корзину и данные покупателя
      basketModel.clear();
      buyerModel.clear();

      // Показываем экран успеха
      const success = new Success(cloneTemplate(successTemplate), events);
      const element = success.render({ total: response.total });
      modal.content = element;
    })
    .catch(err => console.error('Ошибка оформления заказа:', err));
});

// 14. Закрытие экрана успеха
events.on('success:close', () => {
  modal.close();
});

// ─── Загрузка данных с сервера ───────────────────────────────────────────────

larekApi.getProducts()
  .then(data => {
    productsModel.setItems(data.items);
  })
  .catch(err => console.error('Ошибка загрузки товаров:', err));