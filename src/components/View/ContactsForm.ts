import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}