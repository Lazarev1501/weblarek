import { Form } from './Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<any> {
	private cardButton: HTMLButtonElement;
	private cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButton = container.querySelector('button[name="card"]')!;
		this.cashButton = container.querySelector('button[name="cash"]')!;
		this.submitButton = container.querySelector('.order__button')!;

		this.cardButton.addEventListener('click', () => this.setPayment('card'));
		this.cashButton.addEventListener('click', () => this.setPayment('cash'));

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('form:submit');
		});

		this.container.addEventListener('input', () => {
			this.updateValidity();
		});
	}

	private setPayment(type: 'card' | 'cash') {
		this.cardButton.classList.toggle('button_alt-active', type === 'card');
		this.cashButton.classList.toggle('button_alt-active', type === 'cash');

		// View только сообщает событие
		this.events.emit('order:payment', { type });

		this.updateValidity();
	}

	private updateValidity() {
		const addressInput = this.container.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;

		const hasAddress = addressInput.value.trim().length > 0;

		const hasPayment =
			this.cardButton.classList.contains('button_alt-active') ||
			this.cashButton.classList.contains('button_alt-active');

		this.submitButton.disabled = !(hasPayment && hasAddress);
	}
}