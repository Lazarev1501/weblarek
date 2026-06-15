import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CatalogModel {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProduct(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('catalog:selected', product);
  }

  selectProduct(id: string): void {
	const product = this.products.find(item => item.id === id);

	  if (product) {
		  this.selectedProduct = product;
		  this.events.emit('catalog:selected', product);
	  }
  }

  getSelectedProduct(): IProduct | null {
	  return this.selectedProduct;
}
}