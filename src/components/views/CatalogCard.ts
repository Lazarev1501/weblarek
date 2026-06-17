import { CardWithDetails } from './CardWithDetails';
import { IProduct } from '../../types';

type CatalogData = IProduct & { inBasket?: boolean };

export class CatalogCard extends CardWithDetails {
	constructor(
		container: HTMLElement,
		private onClick: () => void
	) {
		super(container);
		container.addEventListener('click', onClick);
	}

	render(data: CatalogData): HTMLElement {
		return super.render({
			title: data.title,
			image: data.image,
			price: data.price,
			category: data.category,
		});
	}
}