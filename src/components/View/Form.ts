import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IFormState {
  errors: string;
  valid: boolean;
}

/**
 * Родительский класс формы.
 * Общий функционал: отображение ошибок, состояние кнопки submit,
 * отслеживание изменений в инпутах.
 */
export abstract class Form extends Component<IFormState> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _form: HTMLFormElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this._form = container;

    this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this._errors = ensureElement<HTMLElement>('.form__errors', container);

    // Слушаем изменения всех инпутов формы — сообщаем презентеру
    this._form.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      events.emit('form:change', { field: target.name, value: target.value });
    });

    // Сабмит формы — генерируем событие для презентера
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit(`${this._form.name}:submit`);
    });
  }

  // Показать или скрыть ошибку
  set errors(value: string) {
    this._errors.textContent = value;
  }

  // Включить или выключить кнопку submit
  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }
}

// ─────────────────────────────────────────────
// Форма шага 1: способ оплаты + адрес доставки (шаблон #order)
// ─────────────────────────────────────────────

/**
 * Форма оформления заказа — первый шаг.
 * Выбор способа оплаты (кнопки) и ввод адреса.
 * Генерирует событие payment:select при выборе способа оплаты.
 */
export class OrderForm extends Form {
  private _paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(
      container.querySelectorAll<HTMLButtonElement>('.order__buttons .button_alt')
    );

    // Клик по кнопке оплаты
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        events.emit('payment:select', { payment: button.name });
      });
    });
  }

  // Выделить активную кнопку оплаты
  set payment(value: string) {
    this._paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }
}

// ─────────────────────────────────────────────
// Форма шага 2: email + телефон (шаблон #contacts)
// ─────────────────────────────────────────────

/**
 * Форма оформления заказа — второй шаг.
 * Ввод email и телефона покупателя.
 */
export class ContactsForm extends Form {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}