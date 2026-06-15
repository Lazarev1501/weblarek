import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface SuccessData {
	total: number;
}

export class Success extends Component<SuccessData> {
	private closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		this.closeButton = container.querySelector('.order-success__close')!;

		this.closeButton.addEventListener('click', () => {
			this.events.emit('order:success-close');
		});
	}

	set total(value: number) {
		const text = this.container.querySelector('.order-success__description')!;
		text.textContent = `Списано ${value} синапсов`;
	}
}