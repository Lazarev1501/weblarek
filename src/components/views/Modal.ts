import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModalData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModalData> {
	protected closeButton: HTMLButtonElement;
	protected contentElement: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);

		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);

		this.closeButton.addEventListener('click', () => {
			this.close();
		});

		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(value);
	}

	open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.contentElement.replaceChildren();
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}