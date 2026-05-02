import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
  total: number;
}

/**
 * Экран успешного оформления заказа.
 * Показывает списанную сумму и кнопку возврата к покупкам.
 */
export class Success extends Component<ISuccess> {
  private _description: HTMLElement;
  private _closeButton: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._description = ensureElement<HTMLElement>('.order-success__description', container);
    this._closeButton = ensureElement<HTMLElement>('.order-success__close', container);

    this._closeButton.addEventListener('click', () => {
      // Закрываем модальное окно и возвращаемся к каталогу
      events.emit('success:close');
    });
  }

  set total(value: number) {
    this._description.textContent = `Списано ${value} синапсов`;
  }
}