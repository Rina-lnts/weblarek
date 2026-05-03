import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
  errors: string;
  valid: boolean;
}

export abstract class Form extends Component<IFormState> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _form: HTMLFormElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this._form = container;

    this._submitButton = container.querySelector('button[type=submit]')!;
    this._errors = container.querySelector('.form__errors')!;

    this._form.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      events.emit('form:change', { field: target.name, value: target.value });
    });

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit(`${this._form.name}:submit`);
    });
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }
}