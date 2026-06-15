import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface BasketViewData {
	items: HTMLElement[];
	total: number;
}

export class BasketView extends Component<BasketViewData> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this.listElement = ensureElement('.basket__list', container);
		this.totalElement = ensureElement('.basket__price', container);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
		this.buttonElement.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		this.listElement.replaceChildren(...items);
	}

	set total(value: number) {
		this.totalElement.textContent = `${value} синапсов`;
	}
}