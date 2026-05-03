import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  private _counter: HTMLElement;
  private _basketButton: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this._counter = container.querySelector('.header__basket-counter')!;
    this._basketButton = container.querySelector('.header__basket')!;

    this._basketButton.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}
