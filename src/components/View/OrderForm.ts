import { Form } from './Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form {
  private _paymentButtons: HTMLButtonElement[];
  private _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(
      container.querySelectorAll<HTMLButtonElement>('.order__buttons .button_alt')
    );
    this._addressInput = container.querySelector<HTMLInputElement>('input[name=address]')!;

    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        events.emit('payment:select', { payment: button.name });
      });
    });
  }

  set payment(value: string) {
    this._paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}