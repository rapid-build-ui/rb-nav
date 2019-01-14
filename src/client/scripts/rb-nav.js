/*********
 * RB-NAV
 *********/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import Activity                from './private/mixins/activity.js';
import Responsive              from './private/mixins/responsive.js';
import template                from '../views/rb-nav.html';

export class RbNav extends Activity(Responsive(RbBase())) {
	/* Lifecycle
	 ************/
	viewReady() {
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			links: null,
			slot:  this.shadowRoot.querySelector('slot')
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
	_setLinks(e) { // :void (links = element[])
		this.rb.elms.links = this.rb.elms.slot
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.tagName.toLowerCase() === 'a');
		// console.log('SET LINKS:  ', this.rb.elms.links);
		this._setTabIndexes();
		this._trimSlot();
		this._addFirstAndLastClasses();
		this.rb.events.emit(this, 'links-changed', {
			detail: { length: this.rb.elms.links.length }
		});
	}
	_setTabIndexes(e) { // :void
		// console.log('TAB INDEXES:', this.rb.elms.links);
		if (!this.rb.elms.links.length) return;
		for (let link of this.rb.elms.links) {
			if (link.hasAttribute('tabindex')) continue;
			link.setAttribute('tabindex', 0);
		}
	}
	_trimSlot(e) { // :void (prevent extra white space)
		// console.log('TRIM SLOT:  ', this.rb.elms.links);
		if (!this.rb.elms.links.length) return;
		for (let link of this.rb.elms.links) {
			for (let child of link.childNodes) {
				if (child.nodeType !== 3) continue;
				child.textContent = child.textContent.trimLeft();
			}
		}
	}
	_addFirstAndLastClasses(e) { // :void
		// console.log('ADD CLASSES:', this.rb.elms.links);
		if (!this.rb.elms.links.length) return;
		const FIRST = 'rb-first';
		const LAST  = 'rb-last';
		for (let link of this.rb.elms.links) {
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