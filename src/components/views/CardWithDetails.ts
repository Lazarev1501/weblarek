import { Card } from './Card';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class CardWithDetails extends Card {
	protected imageElement?: HTMLImageElement;
	protected categoryElement?: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.imageElement = container.querySelector('.card__image') ?? undefined;
		this.categoryElement = container.querySelector('.card__category') ?? undefined;
	}

	set image(value: string) {
		if (!this.imageElement) return;
		this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? '');
	}

	set category(value: string) {
		if (!this.categoryElement) return;
		this.categoryElement.textContent = value;
		const className = categoryMap[value as keyof typeof categoryMap];
		if (className) {
			this.categoryElement.className = `card__category ${className}`;
		}
	}
}