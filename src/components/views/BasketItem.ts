import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class BasketItem extends Component<IProduct> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	protected productId!: string;

	constructor(
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this.titleElement = ensureElement('.card__title', container);
		this.priceElement = ensureElement('.card__price', container);
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete',container);

		this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:remove', {
        id: this.productId
      });
    });
	}

	render(data: IProduct): HTMLElement {
		this.productId = data.id;

		this.titleElement.textContent = data.title;
		this.priceElement.textContent = `${data.price ?? 0} синапсов`;

		return this.container;
	}
}