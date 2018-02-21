/*********
 * RB-NAV
 *********/
import { Element as PolymerElement } from '../../../@polymer/polymer/polymer-element.js';
import Activity from './activity.js';
import template from '../views/rb-nav.html';

export class RbNav extends Activity(PolymerElement) {
	constructor() {
		super();
	}
	connectedCallback() {
		super.connectedCallback();
		if (!this._slot) this._slot = this.root.querySelector('slot');
		this.setTabIndexes();
		// console.log(this.activity);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
	}

	/* Properties
	 ************/
	static get properties() {
		return {
			/* API
			 ******/
			dividers: {
				type: Boolean,
				value: false
			},
			inline: {
				type: Boolean,
				value: false
			},
			kind: {
				type: String,
				value: 'default'
			},
			unresponsive: {
				type: Boolean,
				value: false
			},
			vertical: {
				type: Boolean,
				value: false
			},
			/* Computed
			 ***********/
			_display: {
				type: String,
				computed: 'getDisplay(inline)'
			},
			_dividers: {
				type: String,
				computed: 'getDividers(dividers)'
			},
			_layout: {
				type: String,
				computed: 'getLayout(vertical)'
			},
			_responsive: {
				type: String,
				computed: 'getResponsive(unresponsive)'
			}
		}
	}

	/* Computed Bindings
	 ********************/
	getDisplay(inline) { // :string
		return inline ? 'inline' : 'block';
	}
	getDividers(dividers) { // :string
		return dividers ? 'dividers' : '';
	}
	getLayout(vertical) { // :string
		return vertical ? 'vertical' : 'horizontal';
	}
	getResponsive(unresponsive) { // :string
		return unresponsive ? '' : 'responsive';
	}

	/* Getters
	 **********/
	get links() { // :element[]
		return this._slot
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.tagName.toLowerCase() === 'a');
	}

	/* Private
	 **********/
	setTabIndexes() { // :this
		if (!this.links.length) return this;
		for (let link of this.links) {
			if (link.hasAttribute('tabindex')) continue;
			link.setAttribute('tabindex', 0);
		}
		return this;
	}

	/* Template
	 ***********/
	static get template() { // :template literal
		return template;
	}
}

customElements.define('rb-nav', RbNav);