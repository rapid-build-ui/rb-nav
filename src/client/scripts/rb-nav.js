/*********
 * RB-NAV
 *********/
import { Element as PolymerElement } from '../../../@polymer/polymer/polymer-element.js';
import { DomRepeat as DomRepeat } from '../../../@polymer/polymer/lib/elements/dom-repeat.js';
import { DomBind as DomBind } from '../../../@polymer/polymer/lib/elements/dom-bind.js';
import template from '../views/rb-nav.html';

export class RbNav extends PolymerElement {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.importPath = '/node_modules/@rapid-build-ui/rb-nav';
	}
	ready() {
		super.ready();
		this.collection = [
			{ first: 'Yev', last: 'Okun' },
			{ first: 'Judson', last: 'Younce' }
		];
	}

	/* Properties
	 ************/
	static get properties() {
		return {
			layout:	{
				type: String,
				value: 'horizontal'
			},
			responsive: {
				type: Boolean
			},
			collection: {
				type: Array,
				notify: true
			}
		}
	}

	/* Computed Bindings
	 ********************/
	_setResponsive(responsive) {
		return responsive ? 'responsive' : '';
	}

	/* Template
	 ***********/
	static get template() {
		return template;
	}
}

customElements.define('rb-nav', RbNav);