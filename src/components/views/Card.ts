import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Card extends Component<IProduct> {
	protected titleElement: HTMLElement;
	protected imageElement?: HTMLImageElement;
	protected priceElement?: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.titleElement = ensureElement<HTMLElement>(
			'.card__title',
			container
		);

		this.imageElement =
			container.querySelector<HTMLImageElement>('.card__image') ?? undefined;

		this.priceElement =
			container.querySelector<HTMLElement>('.card__price') ?? undefined;
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set image(value: string) {
		if (this.imageElement) {
			this.imageElement.src = value;
		}
	}

	set price(value: number | null) {
		if (!this.priceElement) return;

		this.priceElement.textContent =
			value === null ? 'Бесценно' : `${value} синапсов`;
	}
}