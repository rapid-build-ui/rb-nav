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
		var links =
			this.root.querySelector('slot')
			.assignedNodes({flatten:true})
			.filter(n => n.nodeType === Node.ELEMENT_NODE)
			.filter(n => n.tagName.toLowerCase() === 'a');
		this.setTabIndexes(links);
		this.attachEvents(links);
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
	getDisplay(inline) {
		return inline ? 'inline' : 'block';
	}
	getDividers(dividers) {
		return dividers ? 'dividers' : '';
	}
	getLayout(vertical) {
		return vertical ? 'vertical' : 'horizontal';
	}
	getResponsive(unresponsive) {
		return unresponsive ? '' : 'responsive';
	}

	/* Private
	 **********/
	setTabIndexes(links) { // :this
		if (!links.length) return this;
		for (let link of links) {
			if (link.hasAttribute('tabindex')) continue;
			link.setAttribute('tabindex', 0);
		}
		return this;
	}

	setActive(links, link) { // :void
		if (link.classList.contains('active')) return;
		for (let link of links)
			if (link.classList.contains('active')) {
				link.classList.remove('active');
				break;
			}
		link.classList.add('active');
	}

	attachEvents(links) { // :this
		if (!links.length) return this;
		this.addEventListener('click', e => {
			let link = e.composedPath()[0];
			if (link.tagName.toLowerCase() !== 'a') return;
			this.setActive(links, link);
		});
		return this;
	}

	/* Template
	 ***********/
	static get template() {
		return template;
	}
}

customElements.define('rb-nav', RbNav);