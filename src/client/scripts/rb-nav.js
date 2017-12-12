/*********
 * RB-NAV
 *********/
import { Element as PolymerElement } from '../../../@polymer/polymer/polymer-element.js';
// import { DomRepeat as DomRepeat } from '../../../@polymer/polymer/lib/elements/dom-repeat.js';
// import { DomBind as DomBind } from '../../../@polymer/polymer/lib/elements/dom-bind.js';
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
		this._slot = this.root.querySelector('slot');
		this.setTabIndexes();
		this.attachEvents();
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
	get _links() { // :element[]
		return this._slot
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.tagName.toLowerCase() === 'a');
	}

	/* Private
	 **********/
	setTabIndexes() { // :this
		if (!this._links.length) return this;
		for (let link of this._links) {
			if (link.hasAttribute('tabindex')) continue;
			link.setAttribute('tabindex', 0);
		}
		return this;
	}

	/* Event Handlers
	 *****************/
	attachEvents() { // :this
		this.addEventListener('click', this.setActive);
		return this;
	}

	setActive(e) { // :void
		if (!this._links.length) return this;
		let link = e.composedPath()[0];
		if (link.tagName.toLowerCase() !== 'a') return;
		if (link.classList.contains('active')) return;
		for (let link of this._links)
			if (link.classList.contains('active')) {
				link.classList.remove('active');
				break;
			}
		link.classList.add('active');
	}

	/* Template
	 ***********/
	static get template() { // :template literal
		return template;
	}
}

customElements.define('rb-nav', RbNav);