import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IPage {
  catalog: HTMLElement[];
  counter: number;
}

/**
 * Компонент главной страницы.
 * Отвечает за: каталог товаров и счётчик корзины в шапке.
 */
export class Page extends Component<IPage> {
  private _catalog: HTMLElement;
  private _counter: HTMLElement;
  private _basketButton: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._catalog = ensureElement<HTMLElement>('.gallery', container);
    this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this._basketButton = ensureElement<HTMLElement>('.header__basket', container);

    // При клике на кнопку корзины — генерируем событие для презентера
    this._basketButton.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }

  // Установить карточки в каталог
  set catalog(cards: HTMLElement[]) {
    this._catalog.replaceChildren(...cards);
  }

  // Установить число на счётчике корзины
  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}