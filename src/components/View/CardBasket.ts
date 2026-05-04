import { Card } from './Card';

export class CardBasket extends Card {
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this._index = container.querySelector('.basket__item-index')!;
    this._deleteButton = container.querySelector('.basket__item-delete')!;

    this._deleteButton.addEventListener('click', onDelete);
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
