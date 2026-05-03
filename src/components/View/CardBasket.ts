import { Card } from './Card';
import { IEvents } from '../base/Events';

export class CardBasket extends Card {
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this._index = container.querySelector('.basket__item-index')!;
    this._deleteButton = container.querySelector('.basket__item-delete')!;

    this._deleteButton.addEventListener('click', () => {
      events.emit('basket:remove', { id: container.dataset.id });
    });
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
