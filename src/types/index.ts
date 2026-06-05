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