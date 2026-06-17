import { IProduct } from '../../types';
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export class BasketItem extends Card {
	private deleteBtn: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		private onRemove: () => void
	) {
		super(container);

		this.deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
		this.deleteBtn.addEventListener('click', onRemove);
	}

	render(data: IProduct): HTMLElement {
		this.title = data.title;
		this.price = data.price;
		return this.container;
	}
}