import { Component } from '../base/Component';

export interface ICardData {
  title: string;
  price: number | null;
  category?: string;
  image?: string;
  description?: string;
  inBasket?: boolean;
  index?: number;
}

export abstract class Card extends Component<ICardData> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector('.card__title')!;
    this._price = container.querySelector('.card__price')!;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
  }
}