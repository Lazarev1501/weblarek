import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<any> {
	private cardButton: HTMLButtonElement;
	private cashButton: HTMLButtonElement;
	private addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
		this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
		this.addressInput = container.querySelector('[name="address"]') as HTMLInputElement;

		this.cardButton.addEventListener('click', () => {
			this.events.emit('order:payment', { type: 'card' });
		});

		this.cashButton.addEventListener('click', () => {
			this.events.emit('order:payment', { type: 'cash' });
		});
	}

	set payment(value: 'card' | 'cash' | null) {
		this.cardButton.classList.toggle('button_alt-active', value === 'card');
		this.cashButton.classList.toggle('button_alt-active', value === 'cash');
	}

	set address(value: string) {
		this.addressInput.value = value;
	}
}