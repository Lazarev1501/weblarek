import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CatalogCard extends Card {
	constructor(
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		container.addEventListener('click', () => {
			this.events.emit('card:select', this);
		});
	}

	protected _id!: string;

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id;
	}

	render(data: IProduct): HTMLElement {
		this.id = data.id;

		return super.render({
			title: data.title,
			image: data.image,
			price: data.price,
		});
	}
}