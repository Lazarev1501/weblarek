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

import { IProduct } from './types';

const events = new EventEmitter();

// ================= MODELS =================
const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

// ================= API =================
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ================= VIEWS =================
const header = new Header(document.querySelector('.header')!, events);
const gallery = new Gallery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('#modal-container')!, events);

const basketView = new BasketView(
	cloneTemplate('#basket'),
	events
);

// ================= STATE =================
let currentPreview: IProduct | null = null;

// ================= RENDER =================

function renderGallery() {
	const cards = catalog.getProducts().map(product => {
		const card = new CatalogCard(
			cloneTemplate('#card-catalog'),
			events
		);

		return card.render({
			...product,
			inBasket: basket.hasProduct(product.id),
		});
	});

	gallery.catalog = cards;
}

function renderBasket() {
	const items = basket.getProducts().map(product => {
		const item = new BasketItem(
			cloneTemplate('#card-basket'),
			events
		);

		return item.render(product);
	});

	basketView.items = items;
	basketView.total = basket.getTotal();
}

// ================= INIT =================

webLarekApi.getProducts()
	.then(data => catalog.setProducts(data.items))
	.catch(console.error);

// ================= GLOBAL SYNC =================

// 🔥 ЕДИНЫЙ источник обновления UI
events.on('basket:changed', () => {
	renderBasket();
	renderGallery();
	header.counter = basket.getCount();
});

// ================= CATALOG =================

events.on('catalog:changed', renderGallery);

// ================= CARD =================

events.on<{ id: string }>('card:select', ({ id }) => {
	const product = catalog.getProduct(id);
	if (!product) return;

	currentPreview = product;

	const preview = new PreviewCard(
		cloneTemplate('#card-preview'),
		events
	);

	modal.render({
		content: preview.render({
			...product,
			inBasket: basket.hasProduct(product.id),
		}),
	});
});

// ================= BASKET TOGGLE =================

events.on<{ id: string }>('basket:toggle', ({ id }) => {
	const product = catalog.getProduct(id);
	if (!product) return;

	if (basket.hasProduct(id)) {
		basket.removeById(id);
	} else {
		basket.addProduct(product);
	}

	// обновляем preview если открыт
	if (currentPreview) {
		const preview = new PreviewCard(
			cloneTemplate('#card-preview'),
			events
		);

		modal.render({
			content: preview.render({
				...currentPreview,
				inBasket: basket.hasProduct(currentPreview.id),
			}),
		});
	}
});

// ================= BASKET OPEN =================

events.on('basket:open', () => {
	modal.render({
		content: basketView.render(),
	});
});

// ================= REMOVE =================

events.on<{ id: string }>('basket:remove', ({ id }) => {
	basket.removeById(id);
});

// ================= ORDER FLOW =================

events.on('order:open', () => {
	modal.render({
		content: new OrderForm(
			cloneTemplate('#order'),
			events
		).render(),
	});
});

events.on('order:next', () => {
	modal.render({
		content: new ContactsForm(
			cloneTemplate('#contacts'),
			events
		).render(),
	});
});

// ================= FORM =================

events.on<{ field: string; value: string }>('form:change', ({ field, value }) => {
	buyer.setField(field as any, value);
});

// ================= PAYMENT =================

events.on<{ type: 'card' | 'cash' }>('order:payment', ({ type }) => {
	buyer.setPayment(type);
});

// ================= ORDER SEND =================

events.on('order:send', () => {
	if (!buyer.isContactsValid()) return;

	const order = {
		...buyer.getData(),
		items: basket.getProducts().map(p => p.id),
		total: basket.getTotal(),
	};

	webLarekApi.createOrder(order)
		.then(result => {
			basket.clear();

			modal.render({
				content: new Success(
					cloneTemplate('#success'),
					events
				).render({ total: result.total }),
			});
		})
		.catch(console.error);
});

// ================= SUCCESS =================

events.on('order:success-close', () => {
	modal.close();
	buyer.clear();
});