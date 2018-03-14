/********************
 * RESPONSIVE MODULE
 ********************/
const LEFT_CLASS       = 'left';
const CLOSED_CLASS     = 'closed';
const RESPONSIVE_CLASS = 'responsive';

const Responsive = superClass => class extends superClass {
	constructor() {
		super();
	}
	connectedCallback() {
		super.connectedCallback();
		if (!this.responsive) return;
		this.__setInitialProps();
		this._nav     = this.root.querySelector('nav');
		this._navMenu = this.root.querySelector('.nav');
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
				type: Boolean,
				value: false
			}
		}
	}

	/* Computed Bindings
	 ********************/
	_responsive(responsive) { // :string
		return responsive ? `${RESPONSIVE_CLASS} ${CLOSED_CLASS}` : null;
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
		let navRect  = this._navMenu.getBoundingClientRect();
		let navX     = navRect.x;
		let navWidth = navRect.width;
		let navTotal = navX + navWidth;
		let isNavViewable = winWidth > navTotal;
		// console.log({ isNavViewable, navTotal, winWidth, navX, navWidth });
		if (isNavViewable) return this._navMenu.classList.remove(LEFT_CLASS);
		this._navMenu.classList.add(LEFT_CLASS);
	}

	/* Event Management
	 *******************/
	_attachResponsiveEvents() { // :void
		this._addEvent(window, 'window', 'click', '_windowClick');
		this._addEvent(window, 'window', 'resize', '_windowResize');
		this._addEvent(this._trigger, 'trigger', 'click', '_triggerClick');
		this._addEvent(this._trigger, 'trigger', 'mouseleave', '_triggerLeave');
	}
	_detachResponsiveEvents() { // :void
		this._removeEvent(window, 'window', 'click', '_windowClick');
		this._removeEvent(window, 'window', 'resize', '_windowResize');
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
		if (window.innerWidth <= 767) return;
		this.__restoreInitialProps();
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