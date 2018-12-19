/********************
 * RESPONSIVE MODULE
 ********************/
import { props } from '../../rb-base/scripts/rb-base.js';
const RESPONSIVE_AT = 768; // pixels

const Responsive = superClass => class extends superClass {
	/* Lifecycle
	 ************/
	viewReady() {
		super.viewReady && super.viewReady();
		if (!this.props.responsive) return;
		Object.assign(this.rb.elms, {
			nav:     this.shadowRoot.querySelector('nav'),
			menu:    this.shadowRoot.querySelector('.nav'),
			trigger: this.shadowRoot.querySelector('.trigger')
		});
		this._attachResponsiveEvents()
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
			responsive: Object.assign({}, props.boolean, { // :boolean | object
				deserialize(val) {
					const enabled = !val; // valueless attr = true
					const defaults = {
						enabled: true,
						closed: true,
						left: false
					};
					if (enabled) return defaults;
					return Object.assign(defaults, JSON.parse(val));
				}
			})
		}
	}

	/* Helpers
	 **********/
	__setResponsive(opts={}) { // :void
		Object.assign(this.responsive, opts);
		this.triggerUpdate();
	}
	__makeNavViewable() { // :void
		if (this.responsive.closed) return;
		setTimeout(() => { // (timeout to ensure menu has dimensions)
			const winWidth  = window.innerWidth;
			const menuRect  = this.rb.elms.menu.getBoundingClientRect();
			const menuX     = menuRect.x;
			const menuWidth = menuRect.width;
			let menuTotal = menuX + menuWidth;
			if (this.responsive.left)
				menuTotal +=  menuWidth; // left changes position of menu's x coordinate
			const isNavViewable = winWidth > menuTotal;
			// console.log({ isNavViewable, winWidth, menuTotal, menuWidth, menuX });
			if (isNavViewable) return this.__setResponsive({ left: false });
			this.__setResponsive({ left: true });
		});
	}

	__scrollToActive() { // :void
		if (this.responsive.closed) return;
		const activeLink = this.rb.elms.links.find(link => link.classList.contains('active'));
		if (!activeLink) return;
		const borderTop = parseInt(getComputedStyle(activeLink).borderTopWidth.slice(0,-2)); // slice removes 'px'
		this.rb.elms.menu.scrollTop = activeLink.offsetTop + borderTop; // (scroll past top border)
	}

	/* Event Management
	 *******************/
	_attachResponsiveEvents() { // :void
		this.rb.events.add(window, 'click touchstart', this._windowClick);
		this.rb.events.add(window, 'resize', this._windowResize);
	}

	/* Event Handlers
	 *****************/
	_windowClick(e) { // :void
		if (this.responsive.closed) return;
		const path = e.composedPath();
		if (path.includes(this.rb.elms.nav)) return;
		this.__setResponsive({ closed: true });
	}
	_windowResize(e) { // :void
		if (window.innerWidth <= RESPONSIVE_AT)
			return this.__makeNavViewable();
		this.__setResponsive({ closed: true });
	}
	_menuClick(e) { // :void
		if (this.responsive.closeOnClick === false) return;
		this.__setResponsive({ closed: true });
	}
	_triggerLeave(e) { // :void
		this.rb.elms.trigger.blur();
	}
	_triggerClick(e) { // :void
		this.__setResponsive({ closed: !this.responsive.closed });
		this.__scrollToActive();
		this.__makeNavViewable();
	}
}

/* Export it!
 *************/
export default Responsive;