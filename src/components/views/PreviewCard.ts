import { IProduct } from '../../types';
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

type PreviewData = IProduct & { inBasket?: boolean };

export class PreviewCard extends Card {
	private button: HTMLButtonElement;
	private description: HTMLElement;
	private id: string = '';

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.button = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);

		this.description = ensureElement('.card__text', container);

		this.button.addEventListener('click', () => {
			if (!this.id) return;

			this.events.emit('basket:toggle', { id: this.id });
		});
	}

	render(data: PreviewData): HTMLElement {
		this.id = data.id;
		this.container.dataset.id = data.id;

		this.description.textContent = data.description;

		this.button.textContent = data.inBasket
			? 'Удалить из корзины'
			: 'В корзину';

		return super.render({
			title: data.title,
			image: data.image,
			price: data.price,
			category: data.category,
		});
	}
}