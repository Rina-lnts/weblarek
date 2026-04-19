import { IProduct, IBasketModel } from '../../types/index';

export class BasketModel implements IBasketModel {
  // Массив товаров в корзине
  private _items: IProduct[] = [];

  // Получить все товары из корзины
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавить товар в корзину
  addItem(item: IProduct): void {
    this._items.push(item);
  }

  // Удалить товар из корзины по id
  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
  }

  // Очистить корзину
  clear(): void {
    this._items = [];
  }

  // Получить общую стоимость товаров
  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  // Получить количество товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  // Проверить, есть ли товар в корзине по id
  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}