import {
	IBuyer,
	TPayment,
	TValidationErrors,
} from '../../types';

import { IEvents } from '../base/Events';

export class BuyerModel {
	protected payment: TPayment | null = null;
	protected email = '';
	protected phone = '';
	protected address = '';

	constructor(private events: IEvents) {}

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

		this.events.emit('buyer:changed');
	}

	setField(field: keyof IBuyer, value: string): void {
		this.setData({
			[field]: value
		} as Partial<IBuyer>);
	}

	setPayment(payment: TPayment): void {
		this.payment = payment;
		this.events.emit('buyer:changed');
	}

	getData(): IBuyer {
		return {
			payment: this.payment,
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

		this.events.emit('buyer:changed');
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

	isOrderValid(): boolean {
		return !!this.payment && !!this.address.trim();
	}

	isContactsValid(): boolean {
		return !!this.email.trim() && !!this.phone.trim();
	}
}