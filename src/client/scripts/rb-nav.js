/*********
 * RB-NAV
 *********/
import { PolymerElement, html } from '../../../@polymer/polymer/polymer-element.js';
import Activity from './activity.js';
import Responsive from './responsive.js';
import template from '../views/rb-nav.html';

export class RbNav extends Activity(Responsive(PolymerElement)) {
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
	 *************/
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
			inverse: {
				type: Boolean,
				value: false
			},
			kind: {
				type: String,
				value: 'default'
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
	_inverse(inverse) { // :string
		return inverse ? 'inverse' : null;
	}
	_layout(vertical) { // :string
		return vertical ? 'vertical' : 'horizontal';
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
	_addEvent(target, targetName, eventName, eventHandler) { // :void
		if (!this._events) this._events = {};
		if (!this._events[targetName]) this._events[targetName] = {};
		if (this._events[targetName][eventHandler]) return;
		this._events[targetName][eventHandler] =
			target === this ? this[eventHandler] : this[eventHandler].bind(this);
		target.addEventListener(eventName, this._events[targetName][eventHandler]);
	}
	_removeEvent(target, targetName, eventName, eventHandler) { // :void
		if (!this._events) return;
		if (!this._events[targetName]) return;
		if (!this._events[targetName][eventHandler]) return;
		target.removeEventListener(eventName, this._events[targetName][eventHandler]);
		delete this._events[targetName][eventHandler];
	}
	_attachEvents() { // :void
		this._addEvent(this._slot, 'slot', 'slotchange', '_setTabIndexes');
		this._addEvent(this._slot, 'slot', 'slotchange', '_trimSlot');
		this._addEvent(this._slot, 'slot', 'slotchange', '_addFirstAndLastClasses');
	}
	_detachEvents() { // :void
		this._removeEvent(this._slot, 'slot', 'slotchange', '_setTabIndexes');
		this._removeEvent(this._slot, 'slot', 'slotchange', '_trimSlot');
		this._removeEvent(this._slot, 'slot', 'slotchange', '_addFirstAndLastClasses');
	}

	/* Event Handlers
	 *****************/
	_setTabIndexes(e) { // :void
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
	_addFirstAndLastClasses(e) { // :void
		if (!this.links.length) return;
		const FIRST = 'rb-first';
		const LAST  = 'rb-last';
		for (let link of this.links) {
			let prevElm = link.previousElementSibling;
			let nextElm = link.nextElementSibling;
			if (!prevElm || prevElm.tagName.toLowerCase() === 'h3')
				link.classList.add(FIRST);
			if (!nextElm || nextElm.tagName.toLowerCase() === 'h3')
				link.classList.add(LAST);
		}
	}

	/* Template
	 ***********/
	static get template() { // :template literal
		return html template;
	}
}

customElements.define('rb-nav', RbNav);