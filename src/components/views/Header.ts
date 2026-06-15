import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { HeaderData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Header extends Component<HeaderData> {
	protected basketButton: HTMLButtonElement;
	protected counterElement: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);

		this.counterElement = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.counterElement.textContent = String(value);
	}
}