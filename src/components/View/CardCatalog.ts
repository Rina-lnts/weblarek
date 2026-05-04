import { Card } from './Card';
import { categoryMap } from '../../utils/constants';

export class CardCatalog extends Card {
  private _category: HTMLElement;
  private _image: HTMLImageElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this._category = container.querySelector('.card__category')!;
    this._image = container.querySelector('.card__image')!;

    container.addEventListener('click', onClick);
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
}