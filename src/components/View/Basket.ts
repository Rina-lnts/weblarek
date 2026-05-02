import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

/**
 * Компонент корзины.
 * Показывает список товаров, итоговую сумму и кнопку оформления.
 */
export class Basket extends Component<IBasketView> {
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', container);
    this._total = ensureElement<HTMLElement>('.basket__price', container);
    this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

    this._orderButton.addEventListener('click', () => {
      events.emit('order:open');
    });
  }

  // Установить карточки товаров в список корзины
  set items(cards: HTMLElement[]) {
    if (cards.length === 0) {
      // Показываем текст «Корзина пуста» вместо списка
      const empty = document.createElement('p');
      empty.textContent = 'Корзина пуста';
      this._list.replaceChildren(empty);
    } else {
      this._list.replaceChildren(...cards);
    }
    // Кнопка оформления активна только если корзина не пуста
    this._orderButton.disabled = cards.length === 0;
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
}