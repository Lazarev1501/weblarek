import { IProduct } from '../../types';

export class BasketModel {
  protected products: IProduct[] = [];

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  removeProduct(product: IProduct): void {
    this.products = this.products.filter(
      (item) => item.id !== product.id
    );
  }

  clear(): void {
    this.products = [];
  }

  getTotalPrice(): number {
    return this.products.reduce(
      (total, item) => total + (item.price ?? 0),
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