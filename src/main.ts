import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

// --- Тестирование ProductsModel ---
const productsModel = new ProductsModel();
productsModel.setItems(apiProducts.items);
console.log('Все товары:', productsModel.getItems());
console.log('Товар по id:', productsModel.getItemById('854cef69-976d-4c2a-a18c-2aa45046c390'));

const firstItem = productsModel.getItems()[0];
productsModel.setPreview(firstItem);
console.log('Товар для просмотра:', productsModel.getPreview());

// --- Тестирование BasketModel ---
const basketModel = new BasketModel();
basketModel.addItem(firstItem);
basketModel.addItem(productsModel.getItems()[1]);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Количество товаров:', basketModel.getCount());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Есть ли первый товар в корзине:', basketModel.hasItem(firstItem.id));

basketModel.removeItem(firstItem.id);
console.log('После удаления первого товара:', basketModel.getItems());

basketModel.clear();
console.log('После очистки корзины:', basketModel.getItems());

// --- Тестирование BuyerModel ---
const buyerModel = new BuyerModel();
console.log('Ошибки валидации (все поля пусты):', buyerModel.validate());

buyerModel.setField('payment', 'card');
buyerModel.setField('address', 'ул. Пушкина, д. 1');
buyerModel.setField('email', 'test@test.ru');
buyerModel.setField('phone', '+79001234567');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации (все поля заполнены):', buyerModel.validate());

buyerModel.clear();
console.log('После очистки данных покупателя:', buyerModel.getData());

// --- Запрос к серверу ---
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi.getProducts()
  .then(data => {
    productsModel.setItems(data.items);
    console.log('Товары с сервера:', productsModel.getItems());
  })
  .catch(err => console.error('Ошибка запроса:', err));