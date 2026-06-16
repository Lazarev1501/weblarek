import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class Card extends Component<IProduct> {
	protected titleElement: HTMLElement;
	protected imageElement?: HTMLImageElement;
	protected priceElement?: HTMLElement;
	protected categoryElement?: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.titleElement = ensureElement(
			'.card__title',
			container
		);

		this.imageElement =
			container.querySelector('.card__image') ?? undefined;

		this.priceElement =
			container.querySelector('.card__price') ?? undefined;

		this.categoryElement =
			container.querySelector('.card__category') ?? undefined;
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set image(value: string) {
		if (!this.imageElement) {
			return;
		}

		this.setImage(
			this.imageElement,
			`${CDN_URL}${value}`,
			this.titleElement.textContent ?? ''
		);
	}

	set price(value: number | null) {
		if (!this.priceElement) {
			return;
		}

		this.priceElement.textContent =
			value === null
				? 'Бесценно'
				: `${value} синапсов`;
	}

	set category(value: string) {
		if (!this.categoryElement) {
			return;
		}

		this.categoryElement.textContent = value;

		const className =
			categoryMap[value as keyof typeof categoryMap];

		if (className) {
			this.categoryElement.className =
				`card__category ${className}`;
		}
	}
}