import { Component } from '../base/Component';
import { GalleryData } from '../../types';

export class Gallery extends Component<GalleryData> {
	constructor(container: HTMLElement) {
		super(container);
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}