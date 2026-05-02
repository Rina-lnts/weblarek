import { IProduct, IBasketModel } from '../../types/index';
import { IEvents } from '../base/Events';

export class BasketModel implements IBasketModel {
  private _items: IProduct[] = [];

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    this._items.push(item);
    // Уведомляем презентер, что содержимое корзины изменилось
    this.events.emit('basket:changed', { items: this._items });
  }

  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.events.emit('basket:changed', { items: this._items });
  }

  clear(): void {
    this._items = [];
    this.events.emit('basket:changed', { items: this._items });
  }

  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}