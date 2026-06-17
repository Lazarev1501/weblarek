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

const basketView = new BasketView(cloneTemplate('#basket'), events);

// ================= FORMS (создаем один раз) =================
const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);
const success = new Success(cloneTemplate('#success'), events);

// ================= RENDER =================

function renderGallery() {
	const cards = catalog.getProducts().map(product => {
		const card = new CatalogCard(
			cloneTemplate('#card-catalog'),
			() => catalog.select(product.id)
		);
		return card.render(product);
	});

	gallery.catalog = cards;
}

function renderBasket() {
	const items = basket.getProducts().map((product, index) => {
		const item = new BasketItem(
			cloneTemplate('#card-basket'),
			() => basket.removeById(product.id)
		);

		const element = item.render(product);
		const indexElement = element.querySelector('.basket__item-index');
		if (indexElement) {
			indexElement.textContent = String(index + 1);
		}

		return element;
	});

	basketView.items = items;
	basketView.total = basket.getTotal();
}

// ================= INIT =================

webLarekApi.getProducts()
	.then(data => catalog.setProducts(data.items))
	.catch(console.error);

// ================= GLOBAL SYNC =================

events.on('basket:changed', () => {
	renderBasket();
	header.counter = basket.getCount();

	const previewId = catalog.getSelectedId();
	if (previewId) {
		const product = catalog.getProduct(previewId);
		const previewContainer = document.querySelector('.modal_active .card_full');
		if (product && previewContainer) {
			const button = previewContainer.querySelector('.card__button') as HTMLButtonElement;
			if (button) {
				button.textContent = basket.hasProduct(product.id) ? 'Удалить из корзины' : 'В корзину';
			}
		}
	}
});

// ================= CATALOG =================

events.on('catalog:changed', renderGallery);

// ================= CARD SELECT =================

events.on<{ id: string }>('card:select', ({ id }) => {
	catalog.select(id);
});

events.on<{ id: string }>('catalog:selected', ({ id }) => {
	const product = catalog.getProduct(id);
	if (!product) return;

	const preview = new PreviewCard(
		cloneTemplate('#card-preview'),
		() => {
			const selectedId = catalog.getSelectedId();
			if (selectedId) {
				const p = catalog.getProduct(selectedId);
				if (p) basket.toggleProduct(p);
			}
		}
	);

	const container = preview.render({
		...product,
		inBasket: basket.hasProduct(product.id),
	});

	modal.render({
		content: container,
	});
});

// ================= BASKET OPEN =================

events.on('basket:open', () => {
	modal.render({
		content: basketView.render(),
	});
});

// ================= BASKET REMOVE =================

events.on<{ id: string }>('basket:remove', ({ id }) => {
	basket.removeById(id);
});

// ================= ORDER FLOW =================

events.on('order:open', () => {
	modal.render({
		content: orderForm.render(),
	});
});

// ================= FORM SUBMIT =================

events.on('form:submit', () => {
	const activeForm = document.querySelector('.modal_active form') as HTMLFormElement | null;
	
	if (!activeForm) return;
	
	if (activeForm.name === 'order') {
		if (buyer.isOrderValid()) {
			modal.render({
				content: contactsForm.render(),
			});
		} else {
			events.emit('buyer:changed');
		}
	} else if (activeForm.name === 'contacts') {
		if (buyer.isContactsValid()) {
			events.emit('order:send');
		} else {
			events.emit('buyer:changed');
		}
	}
});

// ================= FORM CHANGE =================

events.on<{ field: string; value: string }>('form:change', ({ field, value }) => {
	buyer.setField(field as any, value);
});

// ================= PAYMENT =================

events.on<{ type: 'card' | 'cash' }>('order:payment', ({ type }) => {
	buyer.setPayment(type);
});

// ================= BUYER CHANGED =================

events.on('buyer:changed', () => {
	const data = buyer.getData();
	const errors = buyer.validate();

	// OrderForm
	orderForm.payment = data.payment;
	orderForm.address = data.address;

	const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
	orderForm.errors = orderErrors;
	orderForm.valid = !orderErrors.length;

	// ContactsForm
	contactsForm.email = data.email;
	contactsForm.phone = data.phone;

	const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');
	contactsForm.errors = contactsErrors;
	contactsForm.valid = !contactsErrors.length;
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
				content: success.render({ total: result.total }),
			});
		})
		.catch(console.error);
});

// ================= SUCCESS =================

events.on('order:success-close', () => {
	modal.close();
	buyer.clear();
});

// ================= MODAL CLOSE =================

events.on('modal:close', () => {
	catalog.select('');
});