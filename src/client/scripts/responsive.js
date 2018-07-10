/********************
 * RESPONSIVE MODULE
 ********************/
import { props } from '../../../skatejs/dist/esnext/index.js';
const RESPONSIVE_AT = 768; // pixels

const Responsive = superClass => class extends superClass {
	/* Lifecycle
	 ************/
	connectedCallback() {
		super.connectedCallback();
		if (!this.props.responsive) return;
		setTimeout(() => { // (timeout to ensure template is rendered)
			this._nav     = this.shadowRoot.querySelector('nav');
			this._menu    = this.shadowRoot.querySelector('.nav'); // .nav menu
			this._trigger = this.shadowRoot.querySelector('.trigger');
			this._attachResponsiveEvents()
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this.props.responsive) return;
		this._detachResponsiveEvents();
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
		setTimeout(() => { // (timeout to ensure menu has dimensions)
			const winWidth  = window.innerWidth;
			const menuRect  = this._menu.getBoundingClientRect();
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

	/* Event Management
	 *******************/
	_attachResponsiveEvents() { // :void
		this.rbEvent.add(window, 'window', 'click touchstart', '_windowClick');
		this.rbEvent.add(window, 'window', 'resize', '_windowResize');
	}
	_detachResponsiveEvents() { // :void
		this.rbEvent.remove(window, 'window', 'click touchstart', '_windowClick');
		this.rbEvent.remove(window, 'window', 'resize', '_windowResize');
	}

	/* Event Handlers
	 *****************/
	_windowClick(e) { // :void
		if (this.responsive.closed) return;
		const path = e.composedPath();
		if (path.includes(this._nav)) return;
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
		this._trigger.blur();
	}
	_triggerClick(e) { // :void
		this.__setResponsive({ closed: !this.responsive.closed });
		this.__makeNavViewable();
	}
}

/* Export it!
 *************/
export default Responsive;