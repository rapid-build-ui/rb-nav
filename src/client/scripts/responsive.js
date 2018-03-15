/********************
 * RESPONSIVE MODULE
 ********************/
const LEFT_CLASS       = 'left';
const CLOSED_CLASS     = 'closed';
const RESPONSIVE_CLASS = 'responsive';
const RESPONSIVE_AT    = 768; // pixels

const Responsive = superClass => class extends superClass {
	constructor() {
		super();
	}
	connectedCallback() {
		super.connectedCallback();
		if (!this.responsive) return;
		this.__setInitialProps();
		this._nav     = this.root.querySelector('nav');
		this._menu    = this.root.querySelector('.nav'); // .nav menu
		this._trigger = this.root.querySelector('.trigger');
		this.__makeNavViewable();
		this._attachResponsiveEvents()
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this.responsive) return;
		this._detachResponsiveEvents();
	}

	/* Properties
	 *************/
	static get properties() {
		return {
			responsive: {
				type: Object, // :boolean | object { closeOnClick: boolean = true }
				value: false,
				observer: '__updateResponsive'
			}
		}
	}

	/* Observers
	 ************/
	__updateResponsive(newVal, oldVal) { // :void
		if (newVal === false) return;
		if (!!newVal) return; // newVal is options {}
		this.responsive = {}; // for valueless attr
	}

	/* Computed Bindings
	 ********************/
	_responsive(responsive) { // :string
		if (!this.responsive) return;
		return `${RESPONSIVE_CLASS} ${CLOSED_CLASS}`
	}

	/* Helpers
	 **********/
	__setInitialProps() { // :void
		this.__initialProps = {
			dividers: this.dividers,
			vertical: this.vertical
		}
	}
	__restoreInitialProps() { // :void
		this.__setResponsiveProps(this.__initialProps);
	}
	__setResponsiveProps(props) { // :void
		if (typeof props !== 'object') return;
		for (const [key, val] of Object.entries(props))
			this[key] = val;
	}
	__makeNavViewable() { // :void
		let winWidth = window.innerWidth;
		let navRect  = this._menu.getBoundingClientRect();
		let navX     = navRect.x;
		let navWidth = navRect.width;
		let navTotal = navX + navWidth;
		let isNavViewable = winWidth > navTotal;
		// console.log({ isNavViewable, winWidth, navTotal, navWidth, navX });
		if (isNavViewable) return this._menu.classList.remove(LEFT_CLASS);
		this._menu.classList.add(LEFT_CLASS);
	}

	/* Event Management
	 *******************/
	_attachResponsiveEvents() { // :void
		this._addEvent(window, 'window', 'click', '_windowClick');
		this._addEvent(window, 'window', 'resize', '_windowResize');
		this._addEvent(this._menu, 'menu', 'click', '_menuClick');
		this._addEvent(this._trigger, 'trigger', 'click', '_triggerClick');
		this._addEvent(this._trigger, 'trigger', 'mouseleave', '_triggerLeave');
	}
	_detachResponsiveEvents() { // :void
		this._removeEvent(window, 'window', 'click', '_windowClick');
		this._removeEvent(window, 'window', 'resize', '_windowResize');
		this._removeEvent(this._menu, 'menu', 'click', '_menuClick');
		this._removeEvent(this._trigger, 'trigger', 'click', '_triggerClick');
		this._removeEvent(this._trigger, 'trigger', 'mouseleave', '_triggerLeave');
	}

	/* Window Event Handlers
	 ************************/
	_windowClick(e) {
		if (this._nav.classList.contains(CLOSED_CLASS)) return;
		if (e.path.includes(this._nav)) return;
		this._nav.classList.add(CLOSED_CLASS);
	}
	_windowResize(e) {
		if (window.innerWidth <= RESPONSIVE_AT) return;
		this.__restoreInitialProps();
		this._nav.classList.add(CLOSED_CLASS);
	}

	/* Menu Event Handlers
	 **********************/
	_menuClick(e) { // :void
		if (this.responsive.closeOnClick === false) return;
		this._nav.classList.add(CLOSED_CLASS);
	}

	/* Trigger Event Handlers
	 *************************/
	_triggerLeave(e) { // :void
		this._trigger.blur();
	}
	_triggerClick(e) { // :void
		this.__setResponsiveProps({ dividers: true, vertical: true });
		this._nav.classList.toggle(CLOSED_CLASS);
	}
}

/* Export it!
 *************/
export default Responsive;