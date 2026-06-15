import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { WebLarekApi } from './components/Models/WebLarekApi';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';

import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';

import { BasketView } from './components/views/BasketView';
import { BasketItem } from './components/views/BasketItem';

import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

import { cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';

const events = new EventEmitter();

const orderForm = new OrderForm(cloneTemplate('#order'), events);

// MODELS
const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

// API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// VIEWS
const header = new Header(document.querySelector('.header')!, events);
const gallery = new Gallery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('#modal-container')!, events);

// basket view 
const basketView = new BasketView(cloneTemplate('#basket'), events);

// STATE
let orderData: any = {};

// ================= CATALOG =================
events.on('catalog:changed', () => {
	const cards = catalog.getProducts().map(product => {
		const card = new CatalogCard(cloneTemplate('#card-catalog'), events);
		return card.render(product);
	});

	gallery.catalog = cards;
});

// ================= SELECT PRODUCT =================
events.on('card:select', (card: CatalogCard) => {
	const product = catalog.getProduct(card.id);
	if (!product) return;

	const preview = new PreviewCard(cloneTemplate('#card-preview'), events);

	modal.render({
		content: preview.render(product)
	});
});

// ================= BASKET =================
events.on<{ id: string }>('basket:add', ({ id }) => {
	const product = catalog.getProduct(id);
	if (!product) return;

	basket.addProduct(product);
	modal.close();
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
	basket.removeById(id);

	const items = basket.getProducts().map(product => {
		const item = new BasketItem(cloneTemplate('#card-basket'), events);
		return item.render(product);
	});

	basketView.render({
		items,
		total: basket.getTotal()
	});

	modal.render({ content: basketView.render() });
});

events.on('basket:open', () => {
	const items = basket.getProducts().map(product => {
		const item = new BasketItem(cloneTemplate('#card-basket'), events);
		return item.render(product);
	});

	basketView.render({
		items,
		total: basket.getTotal()
	});

	modal.render({ content: basketView.render() });
});

events.on('basket:changed', () => {
	header.counter = basket.getCount();
});

// ================= FORMS =================

type FormChangeEvent = {
	field: string;
	value: string;
};

type OrderPaymentEvent = {
	type: string;
};

events.on('form:change', (data: FormChangeEvent) => {
	const { field, value } = data;

	orderData[field] = value;
	buyer.setData(orderData);
});

events.on('order:payment', (data: OrderPaymentEvent) => {
	orderData.payment = data.type;
});

events.on('form:submit', () => {
	if (!orderData.payment || !orderData.address) return;

	modal.render({
		content: new ContactsForm(cloneTemplate('#contacts'), events).render()
	});
});

// ================= ORDER FLOW =================
events.on('order:contacts', () => {
	const form = new ContactsForm(cloneTemplate('#contacts'), events);

	modal.render({
		content: form.render()
	});
});

events.on('order:send', () => {
	if (!orderData.email || !orderData.phone) return;

	const order = {
		...orderData,
		items: basket.getProducts().map(p => p.id),
		total: basket.getTotal()
	};

	webLarekApi.createOrder(order)
		.then(result => {
			basket.clear();

			const success = new Success(
				cloneTemplate('#success'),
				events
			);

			success.total = result.total;

			modal.render({
				content: success.render({ total: result.total })
			});
		})
		.catch(console.error);
});

events.on('order:success-close', () => {
	modal.close();
	orderData = {};
});

events.on('order:open', () => {
	modal.render({
		content: orderForm.render()
	});
});

// ================= LOAD DATA =================
webLarekApi.getProducts()
	.then(data => catalog.setProducts(data.items))
	.catch(console.error);