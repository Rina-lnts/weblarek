import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export class CardPreview extends Card {
  private _category: HTMLElement;
  private _image: HTMLImageElement;
  private _description: HTMLElement;
  private _button: HTMLButtonElement;
  private _inBasket: boolean = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._category = container.querySelector('.card__category')!;
    this._image = container.querySelector('.card__image')!;
    this._description = container.querySelector('.card__text')!;
    this._button = container.querySelector('.card__button')!;

    this._button.addEventListener('click', () => {
      events.emit('card:buy', { id: container.dataset.id, inBasket: this._inBasket });
    });
  }

  set category(value: string) {
    this._category.textContent = value;
    Object.values(categoryMap).forEach(cls => this._category.classList.remove(cls));
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) this._category.classList.add(modifier);
  }

  set image(src: string) {
    this._image.src = src;
    this._image.alt = this._title.textContent ?? '';
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set inBasket(value: boolean) {
    this._inBasket = value;
    this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this._button.disabled = true;
      this._button.textContent = 'Недоступно';
    }
  }
}