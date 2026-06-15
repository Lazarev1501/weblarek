export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

/* Ответ сервера со списком товаров */
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

/* Данные заказа */
export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

/* Ответ сервера после оформления заказа */
export interface IOrderResult {
    id: string;
    total: number;
}

export interface HeaderData {
    counter: number;
}

export interface GalleryData {
    catalog: HTMLElement[];
}

export interface ICardActions {
    onClick(event: MouseEvent): void;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IFormState {
    valid: boolean;
    errors: string;
}

export interface IOrderForm {
    payment: TPayment;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface ISuccessData {
    total: number;
}

export interface ISuccessActions {
    onClick(): void;
}

export interface IOrderData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}