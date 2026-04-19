import { IApi, IProductsResponse, IOrderRequest, IOrderResponse } from '../types/index';

export class LarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  // Получить список товаров с сервера
  getProducts(): Promise<IProductsResponse> {
    return this._api.get<IProductsResponse>('/product/');
  }

  // Отправить заказ на сервер
  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this._api.post<IOrderResponse>('/order/', order);
  }
}