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
		const nav = this.root.querySelector('nav');
		this.createNav(nav);
		var links = nav.querySelectorAll('a');
		this.setTabIndexes(links);
		this.attachEvents(nav, links);
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

	/* Private
	 **********/
	createNav(nav) {
		nav.innerHTML = this.innerHTML;
	}

	setActive(nav, link) {
		var active = nav.querySelector('a.active');
		if (active === link) return;
		if (active) active.classList.remove('active');
		link.classList.add('active');
	}

	setTabIndexes(links) {
		if (!links.length) return;
		for (let link of links) {
			if (link.hasAttribute('tabindex')) continue;
			link.setAttribute('tabindex', 0);
		}
	}

	attachEvents(nav, links) {
		if (!links.length) return;
		this.addEventListener('click', e => {
			var link = e.composedPath()[0];
			if (link & link.tagName.toLowerCase() !== 'a') return;
			this.setActive(nav, link);
		});
	}

	/* Computed Bindings
	 ********************/
	setResponsive(responsive) {
		return responsive ? 'responsive' : '';
	}

	/* Template
	 ***********/
	static get template() {
		return template;
	}
}

customElements.define('rb-nav', RbNav);