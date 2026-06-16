import { IProduct } from '../../types';
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class BasketItem extends Card {
	private deleteBtn: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.deleteBtn = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		this.deleteBtn.addEventListener('click', () => {
			const id = this.container.dataset.id;
			if (!id) return;

			this.events.emit('basket:remove', { id });
		});
	}

	render(data: IProduct): HTMLElement {
		this.container.dataset.id = data.id;

		this.title = data.title;
		this.price = data.price;

		return this.container;
	}
}