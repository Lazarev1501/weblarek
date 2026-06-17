import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<any> {
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput = container.querySelector('[name="email"]') as HTMLInputElement;
		this.phoneInput = container.querySelector('[name="phone"]') as HTMLInputElement;
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}