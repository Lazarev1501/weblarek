import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CatalogModel {
	private products: IProduct[] = [];
	private selectedId: string | null = null;

	constructor(private events: IEvents) {}

	setProducts(products: IProduct[]): void {
		this.products = products;
		this.events.emit('catalog:changed');
	}

	getProducts(): IProduct[] {
		return this.products;
	}

	getProduct(id: string): IProduct | undefined {
		return this.products.find(p => p.id === id);
	}

	select(id: string): void {
		this.selectedId = id;
		this.events.emit('catalog:selected', { id });
	}

	getSelected(): IProduct | null {
		return this.products.find(p => p.id === this.selectedId) ?? null;
	}
}