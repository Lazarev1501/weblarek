import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Models/WebLarekApi';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data'; // для локальной проверки 


// ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ

const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();

// ПРОВЕРКА МОДЕЛЕЙ (локально, без сервера)

catalog.setProducts(apiProducts.items);

console.log('Локальный каталог товаров:', catalog.getProducts());

console.log(
  'Товар по id:',
  catalog.getProduct(apiProducts.items[0].id)
);

catalog.setSelectedProduct(apiProducts.items[0]);

console.log(
  'Выбранный товар:',
  catalog.getSelectedProduct()
);

basket.addProduct(apiProducts.items[0]);
basket.addProduct(apiProducts.items[1]);

console.log('Корзина:', basket.getProducts());
console.log('Кол-во товаров:', basket.getCount());
console.log('Сумма:', basket.getTotalPrice());
console.log('Есть товар:', basket.hasProduct(apiProducts.items[0].id));

basket.removeProduct(apiProducts.items[0]);
console.log('После удаления:', basket.getProducts());

basket.clear();
console.log('После очистки:', basket.getProducts());

buyer.setData({
  email: 'test@test.ru',
  phone: '+79991234567',
});

buyer.clear();
console.log('Покупатель после очистки:', buyer.getData());
console.log('Ошибки после очистки:', buyer.validate());

console.log('Покупатель:', buyer.getData());
console.log('Ошибки:', buyer.validate());

// API 

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА

webLarekApi
  .getProducts()
  .then((data) => {
    catalog.setProducts(data.items);

    console.log(
      'Каталог товаров с сервера:',
      catalog.getProducts()
    );

    console.log(
      'Всего товаров:',
      data.total
    );
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });

