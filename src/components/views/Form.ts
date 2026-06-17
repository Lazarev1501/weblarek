import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = container.querySelector('button[type="submit"]')!;
		this.errorsElement = container.querySelector('.form__errors')!;

		this.container.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			this.events.emit('form:change', { field: target.name, value: target.value });
		});

		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('form:submit');
		});
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}

	set errors(value: string) {
		this.errorsElement.textContent = value;
	}
}