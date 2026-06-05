import {
  IBuyer,
  TPayment,
  TValidationErrors,
} from '../../types';

export class BuyerModel {
  protected payment: TPayment | null = null;
  protected email = '';
  protected phone = '';
  protected address = '';

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }
  }

  getData(): Partial<IBuyer> {
    return {
      payment: this.payment ?? undefined,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    if (!this.address.trim()) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}