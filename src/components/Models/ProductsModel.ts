import { IProduct, IProductsModel } from '../../types/index';

export class ProductsModel implements IProductsModel  {
  // Массив всех товаров каталога
  private _items: IProduct[] = [];
  
  // Товар, выбранный для подробного просмотра
  private _preview: IProduct | null = null;

  // Сохранить массив товаров в модель
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  // Получить все товары
  getItems(): IProduct[] {
    return this._items;
  }

  // Получить один товар по его id
  getItemById(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  // Сохранить товар для подробного просмотра
  setPreview(item: IProduct): void {
    this._preview = item;
  }

  // Получить товар для подробного просмотра
  getPreview(): IProduct | null {
    return this._preview;
  }
}