/*********
 * RB-NAV
 *********/
import { Element as PolymerElement } from '../../../@polymer/polymer/polymer-element.js';
import { DomIf as DomIf } from '../../../@polymer/polymer/lib/elements/dom-if.js';
import Activity from './activity.js';
import template from '../views/rb-nav.html';

export class RbNav extends Activity(PolymerElement) {
	constructor() {
		super();
	}
	connectedCallback() {
		super.connectedCallback();
		if (!this._slot) this._slot = this.root.querySelector('slot');
		this._attachEvents();
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this._detachEvents();
	}

	/* Properties
	 ************/
	static get properties() {
		return {
			/* API
			 ******/
			caption: {
				type: String
			},
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
			responsive: {
				type: Boolean,
				value: false
			},
			vertical: {
				type: Boolean,
				value: false
			}
		}
	}

	/* Computed Bindings
	 ********************/
	_display(inline) { // :string
		return inline ? 'inline' : 'block';
	}
	_dividers(dividers) { // :string
		return dividers ? 'dividers' : null;
	}
	_layout(vertical) { // :string
		return vertical ? 'vertical' : 'horizontal';
	}
	_responsive(responsive) { // :string
		return responsive ? 'responsive' : null;
	}

	/* Getters
	 **********/
	get links() { // :element[]
		return this._slot
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.tagName.toLowerCase() === 'a');
	}

	/* Event Management
	 *******************/
	_attachEvents() { // :void
		this._slot.addEventListener('slotchange', this._setTabIndexes.bind(this));
		this._slot.addEventListener('slotchange', this._trimSlot.bind(this));
	}
	_detachEvents() { // :void
		this._slot.removeEventListener('slotchange', this._setTabIndexes);
		this._slot.removeEventListener('slotchange', this._trimSlot);
	}

	/* Event Handlers
	 *****************/
	_setTabIndexes() { // :void
		if (!this.links.length) return;
		for (let link of this.links) {
			if (link.hasAttribute('tabindex')) continue;
			link.setAttribute('tabindex', 0);
		}
	}
	_trimSlot(e) { // :void (prevent extra white space)
		if (!this.links.length) return;
		for (let link of this.links) {
			for (let child of link.childNodes) {
				if (child.nodeType !== 3) continue;
				child.textContent = child.textContent.trimLeft();
			}
		}
	}

	/* Template
	 ***********/
	static get template() { // :template literal
		return template;
	}
}

customElements.define('rb-nav', RbNav);