import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IModal {
  content: HTMLElement;
}

/**
 * Компонент модального окна.
 * Управляет показом/скрытием и вставкой контента внутрь.
 * Не имеет дочерних классов — контент передаётся снаружи.
 */
export class Modal extends Component<IModal> {
  private _content: HTMLElement;
  private _closeButton: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._closeButton = ensureElement<HTMLElement>('.modal__close', container);

    // Закрытие по крестику
    this._closeButton.addEventListener('click', () => {
      this.close();
    });

    // Закрытие по клику вне модального окна (на оверлей)
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.close();
      }
    });

    events.on('modal:close', () => this.close());
  }

  // Установить содержимое модального окна
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    // Очищаем контент при закрытии
    this._content.replaceChildren();
  }
}