import { IProduct } from '../../types';
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class PreviewCard extends Card {
	protected descriptionElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	protected productId!: string;

	constructor(
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this.descriptionElement = ensureElement(
			'.card__text',
			container
		);

		this.buttonElement = ensureElement<HTMLButtonElement>(
	    '.card__button',
	    container
    );

		this.buttonElement.addEventListener('click', () => {
      this.events.emit('basket:add', {
        id: this.productId
      });
    });
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	render(data: IProduct): HTMLElement {
		this.productId = data.id;

		return super.render({
			title: data.title,
			image: data.image,
			price: data.price,
			description: data.description
		});
	}
}