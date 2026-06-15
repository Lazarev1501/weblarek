import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<any> {

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.submitButton = container.querySelector('button[type="submit"]')!;

		this.container.addEventListener('input', () => {
			this.updateValidity();
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:send');
		});

		this.updateValidity();
	}

	private updateValidity() {
		const email = this.container.querySelector('input[name="email"]') as HTMLInputElement;
		const phone = this.container.querySelector('input[name="phone"]') as HTMLInputElement;

		const isValid =
			email.value.trim().length > 0 &&
			phone.value.trim().length > 0;

		this.submitButton.disabled = !isValid;
	}
}