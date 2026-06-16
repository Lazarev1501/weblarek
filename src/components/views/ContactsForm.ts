import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<any> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.submitButton = container.querySelector('button[type="submit"]')!;

		this.container.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;

			this.events.emit<{ field: string; value: string }>('form:change', {
				field: target.name,
				value: target.value,
			});

			this.updateValidity();
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:send');
		});

		this.updateValidity();
	}

	private updateValidity() {
		const email = this.container.querySelector<HTMLInputElement>('input[name="email"]')!;
		const phone = this.container.querySelector<HTMLInputElement>('input[name="phone"]')!;

		const isValid =
			email.value.trim().length > 0 &&
			phone.value.trim().length > 0;

		this.submitButton.disabled = !isValid;
	}
}