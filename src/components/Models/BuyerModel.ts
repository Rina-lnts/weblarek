import { IBuyer, TPayment, IBuyerModel, TBuyerValidationErrors } from '../../types/index';

export class BuyerModel implements IBuyerModel {
  private _payment: TPayment | null = null;
  private _email: string = '';
  private _phone: string = '';
  private _address: string = '';

  // Сохранить одно или несколько полей покупателя
  setField(field: keyof IBuyer, value: string): void {
    if (field === 'payment') {
      this._payment = value as TPayment;
    } else {
      this[`_${field}`] = value;
    }
  }

  // Получить все данные покупателя
  getData(): IBuyer {
  return {
    payment: this._payment,
    email: this._email,
    phone: this._phone,
    address: this._address,
  };
}

  // Очистить данные покупателя
  clear(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  // Валидация — возвращает объект с ошибками
  validate(): TBuyerValidationErrors {
  const errors: TBuyerValidationErrors = {};

  if (!this._payment) errors.payment = 'Не выбран способ оплаты';
  if (!this._address.trim()) errors.address = 'Введите адрес доставки';
  if (!this._email.trim()) errors.email = 'Введите email';
  if (!this._phone.trim()) errors.phone = 'Введите телефон';

  return errors;
}
}