import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { Card } from './Card';

type CatalogData = IProduct & { inBasket?: boolean };

export class CatalogCard extends Card {
	constructor(
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		container.addEventListener('click', () => {
			const id = this.container.dataset.id;
			if (!id) return;

			this.events.emit('card:select', { id });
		});
	}

	render(data: CatalogData): HTMLElement {
		this.container.dataset.id = data.id;

		return super.render({
			title: data.title,
			image: data.image,
			price: data.price,
			category: data.category,
		});
	}
}