import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

/**
 * Родительский класс карточки товара.
 * Содержит общие для всех вариантов карточек поля и сеттеры.
 */
interface ICardData {
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
  protected _category: HTMLElement | null;
  protected _image: HTMLImageElement | null;

  constructor(container: HTMLElement) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    // category и image есть не во всех шаблонах, ищем без ошибки
    this._category = container.querySelector('.card__category');
    this._image = container.querySelector('.card__image');
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      // Сбрасываем все модификаторы категории и ставим нужный
      Object.values(categoryMap).forEach(cls => this._category!.classList.remove(cls));
      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) this._category.classList.add(modifier);
    }
  }

  set image(src: string) {
    if (this._image) {
      this._image.src = src;
      this._image.alt = this._title.textContent ?? '';
    }
  }
}

// ─────────────────────────────────────────────
// Карточка для каталога (шаблон #card-catalog)
// ─────────────────────────────────────────────

/**
 * Карточка в галерее на главной странице.
 * При клике генерирует событие card:select с данными товара.
 */
export class CardCatalog extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    container.addEventListener('click', () => {
      events.emit('card:select', { id: container.dataset.id });
    });
  }
}

// ─────────────────────────────────────────────
// Карточка для превью в модальном окне (шаблон #card-preview)
// ─────────────────────────────────────────────

/**
 * Детальная карточка товара в модальном окне.
 * Содержит описание и кнопку «Купить» / «Удалить из корзины».
 * Генерирует событие card:buy при нажатии кнопки.
 */
export class CardPreview extends Card {
  private _button: HTMLButtonElement;
  private _description: HTMLElement;
  private _inBasket: boolean = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._button = ensureElement<HTMLButtonElement>('.card__button', container);
    this._description = ensureElement<HTMLElement>('.card__text', container);

    this._button.addEventListener('click', () => {
      // Генерируем одно событие — презентер решит, добавить или удалить
      events.emit('card:buy', { id: container.dataset.id, inBasket: this._inBasket });
    });
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  // Управляем состоянием кнопки в зависимости от наличия товара в корзине
  set inBasket(value: boolean) {
    this._inBasket = value;
    this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  // Если у товара нет цены — блокируем кнопку
  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this._button.disabled = true;
      this._button.textContent = 'Недоступно';
    }
  }
}

// ─────────────────────────────────────────────
// Карточка в корзине (шаблон #card-basket)
// ─────────────────────────────────────────────

/**
 * Карточка товара внутри корзины.
 * Показывает порядковый номер, название, цену и кнопку удаления.
 * Генерирует событие basket:remove при нажатии кнопки удаления.
 */
export class CardBasket extends Card {
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this._deleteButton.addEventListener('click', () => {
      events.emit('basket:remove', { id: container.dataset.id });
    });
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}