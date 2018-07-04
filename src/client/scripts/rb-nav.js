/*********
 * RB-NAV
 *********/
import { props, withComponent } from '../../../skatejs/dist/esnext/index.js';
import { html, withRenderer } from './renderer.js';
import EventService from './event-service.js';
import Activity from './activity.js';
import Responsive from './responsive.js';
import template from '../views/rb-nav.html';

export class RbNav extends Activity(Responsive(withComponent(withRenderer()))) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.rbEvent = EventService.call(this);
	}
	connected() {
		setTimeout(() => { // (timeout to ensure template is rendered)
			this._slot = this.shadowRoot.querySelector('slot');
			this._attachEvents();
		});
	}
	disconnected() {
		this._detachEvents();
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
			dividers: props.boolean,
			inline: props.boolean,
			inverse: props.boolean,
			kind: props.string,
			vertical: props.boolean
		}
	}

	/* Event Management
	 *******************/
	_attachEvents() { // :void
		this._setLinks();
		this.rbEvent.add(this._slot, 'slot', 'slotchange', '_setLinks');
	}
	_detachEvents() { // :void
		this.rbEvent.remove(this._slot, 'slot', 'slotchange', '_setLinks');
	}

	/* Event Handlers
	 *****************/
	_setLinks(e) { // :void (links = element[])
		this.links = this._slot
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.tagName.toLowerCase() === 'a');
		// console.log('SET LINKS:  ', this.links);
		this._setTabIndexes();
		this._trimSlot();
		this._addFirstAndLastClasses();
		this.rbEvent.emit(this, 'links-changed', {
			detail: { length: this.links.length }
		});
	}
	_setTabIndexes(e) { // :void
		// console.log('TAB INDEXES:', this.links);
		if (!this.links.length) return;
		for (let link of this.links) {
			if (link.hasAttribute('tabindex')) continue;
			link.setAttribute('tabindex', 0);
		}
	}
	_trimSlot(e) { // :void (prevent extra white space)
		// console.log('TRIM SLOT:  ', this.links);
		if (!this.links.length) return;
		for (let link of this.links) {
			for (let child of link.childNodes) {
				if (child.nodeType !== 3) continue;
				child.textContent = child.textContent.trimLeft();
			}
		}
	}
	_addFirstAndLastClasses(e) { // :void
		// console.log('ADD CLASSES:', this.links);
		if (!this.links.length) return;
		const FIRST = 'rb-first';
		const LAST  = 'rb-last';
		for (let link of this.links) {
			link.classList.remove(FIRST, LAST);
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
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-nav', RbNav);