import { IProduct } from '../../types';
import { CardWithDetails } from './CardWithDetails';
import { ensureElement } from '../../utils/utils';

type PreviewData = IProduct & { inBasket?: boolean };

export class PreviewCard extends CardWithDetails {
	private button: HTMLButtonElement;
	private description: HTMLElement;

	constructor(
		container: HTMLElement,
		private onButtonClick: () => void
	) {
		super(container);

		this.button = ensureElement<HTMLButtonElement>('.card__button', container);
		this.description = ensureElement('.card__text', container);

		this.button.addEventListener('click', onButtonClick);
	}

	render(data: PreviewData): HTMLElement {
		this.description.textContent = data.description;
		this.button.textContent = data.inBasket ? 'Удалить из корзины' : 'В корзину';

		return super.render({
			title: data.title,
			image: data.image,
			price: data.price,
			category: data.category,
		});
	}
}