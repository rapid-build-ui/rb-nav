/*********
 * RB-NAV
 *********/
import { RbBase, props, html } from '../../base/scripts/base.js';
import Activity                from './private/mixins/activity.js';
import Responsive              from './private/mixins/responsive.js';
import template                from '../views/rb-nav.html';

export class RbNav extends Activity(Responsive(RbBase())) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.version = '0.0.17';
	}
	viewReady() {
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			links:    [],
			popovers: [],
			slot:     this.shadowRoot.querySelector('slot')
		});
		this._attachEvents();
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
			dark:     props.boolean,
			dividers: props.boolean,
			inline:   props.boolean,
			kind:     props.string,
			vertical: props.boolean
		}
	}

	/* Event Management
	 *******************/
	_attachEvents() { // :void
		this._setLinks();
		this.rb.events.add(this.rb.elms.slot, 'slotchange', this._setLinks);
	}

	/* Event Handlers
	 *****************/
	_setLinks(evt) { // :void (links = element[])
		this.rb.elms.links = this.rb.elms.slot
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.localName === 'a' || n.localName === 'rb-popover');
		// console.log('SET LINKS:', this.rb.elms.links);
		this._setTabIndexes();
		this._addFirstAndLastClasses();
		this.rb.events.emit(this, 'links-changed', {
			detail: { length: this.rb.elms.links.length }
		});
		this._setPopovers(evt);
	}
	_setPopovers(evt) { // :void (popovers = element[])
		this.rb.elms.popovers = this.rb.elms.links
			.filter(n => n.localName === 'rb-popover');
		if (!this.rb.elms.popovers.length) return;
		// console.log('SET POPOVERS:', this.rb.elms.popovers);
		this.rb.events.emit(this, 'popovers-changed', {
			detail:  { length: this.rb.elms.popovers.length }
		});
	}
	_setTabIndexes(evt) { // :void
		// console.log('TAB INDEXES:', this.rb.elms.links);
		if (!this.rb.elms.links.length) return;
		for (const link of this.rb.elms.links) {
			if (link.hasAttribute('tabindex')) continue;
			if (link.localName === 'rb-popover') continue;
			link.setAttribute('tabindex', 0);
		}
	}
	_addFirstAndLastClasses(evt) { // :void
		// console.log('ADD CLASSES:', this.rb.elms.links);
		if (!this.rb.elms.links.length) return;
		const FIRST = 'first';
		const LAST  = 'last';
		for (const link of this.rb.elms.links) {
			link.classList.remove(FIRST, LAST);
			const prevElm = link.previousElementSibling;
			const nextElm = link.nextElementSibling;
			if (!prevElm || prevElm.localName === 'h3')
				link.classList.add(FIRST);
			if (!nextElm || nextElm.localName === 'h3')
				link.classList.add(LAST);
		}
	}

	/* Template
	 ***********/
	render({ props, state }) { // :string
		return html template;
	}
}

customElements.define('rb-nav', RbNav);