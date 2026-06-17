import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Card extends Component<IProduct> {
	protected titleElement: HTMLElement;
	protected priceElement?: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.titleElement = ensureElement('.card__title', container);
		this.priceElement = container.querySelector('.card__price') ?? undefined;
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		if (!this.priceElement) return;
		this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
	}
}