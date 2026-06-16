import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<any> {
	private cardButton: HTMLButtonElement;
	private cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
		this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

		this.cardButton.addEventListener('click', () => {
			this.setPayment('card');
		});

		this.cashButton.addEventListener('click', () => {
			this.setPayment('cash');
		});

		this.container.addEventListener('input', () => {
			this.updateValidity();
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:next');
		});

		this.updateValidity();
	}

	private setPayment(type: 'card' | 'cash') {
		this.cardButton.classList.toggle('button_alt-active', type === 'card');
		this.cashButton.classList.toggle('button_alt-active', type === 'cash');

		this.events.emit('order:payment', { type });

		this.updateValidity();
	}

	private updateValidity() {
		const address = (this.container.querySelector('[name="address"]') as HTMLInputElement).value;

		const hasAddress = address.trim().length > 0;

		const hasPayment =
			this.cardButton.classList.contains('button_alt-active') ||
			this.cashButton.classList.contains('button_alt-active');

		this.submitButton.disabled = !(hasAddress && hasPayment);
	}
}