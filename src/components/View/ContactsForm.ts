import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._emailInput = container.querySelector<HTMLInputElement>('input[name=email]')!;
    this._phoneInput = container.querySelector<HTMLInputElement>('input[name=phone]')!;
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}

