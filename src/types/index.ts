export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Описывает один товар из каталога
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null; // null — если товар недоступен (нет цены)
}

// Тип для способа оплаты — только два возможных значения
export type TPayment = 'card' | 'cash';

// Описывает данные покупателя при оформлении заказа
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Описывает объект, который сервер возвращает при запросе каталога
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Описывает данные, которые мы отправляем на сервер при оформлении заказа
export interface IOrderRequest extends IBuyer {
  items: string[]; // массив id товаров
  total: number;   // итоговая сумма
}

// Описывает ответ сервера после успешного оформления заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// Интерфейс для класса каталога товаров
export interface IProductsModel {
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItemById(id: string): IProduct | undefined;
  setPreview(item: IProduct): void;
  getPreview(): IProduct | null;
}

// Интерфейс для класса корзины
export interface IBasketModel {
  getItems(): IProduct[];
  addItem(item: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getTotalPrice(): number;
  getCount(): number;
  hasItem(id: string): boolean;
}

// Интерфейс для класса данных покупателя
export interface IBuyerModel {
  setField(field: keyof IBuyer, value: string): void;
  getData(): IBuyer;
  clear(): void;
  validate(): TBuyerValidationErrors;
}

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;