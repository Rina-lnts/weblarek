import { IProduct, IProductsModel } from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductsModel implements IProductsModel {
  private _items: IProduct[] = [];
  private _preview: IProduct | null = null;

  constructor(private events: IEvents) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    // Уведомляем презентер, что каталог товаров изменился
    this.events.emit('catalog:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItemById(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setPreview(item: IProduct): void {
    this._preview = item;
    // Уведомляем презентер, что выбран товар для просмотра
    this.events.emit('preview:changed', { item: this._preview });
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}