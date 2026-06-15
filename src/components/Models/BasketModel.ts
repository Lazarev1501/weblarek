import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class BasketModel {
  protected products: IProduct[] = [];

  constructor(private events: IEvents) {}

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
    this.events.emit('basket:changed');
  }

  removeById(id: string): void {
      this.products = this.products.filter(p => p.id !== id);
      this.events.emit('basket:changed');
    }

  clear(): void {
    this.products = [];
    this.events.emit('basket:changed');
  }

  getTotal(): number {
	return this.products.reduce(
		(sum, item) => sum + (item.price ?? 0),
		0
	);
}

  getCount(): number {
    return this.products.length;
  }

  hasProduct(id: string): boolean {
    return this.products.some((item) => item.id === id);
  }
}