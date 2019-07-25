/********************
 * RESPONSIVE MODULE
 ********************/
import { props } from '../../../../base/scripts/base.js';
import Type      from '../../../../base/scripts/public/services/type.js';

const Responsive = BaseElm => class extends BaseElm {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this.state = {
			...super.state,
			responsive: {
				_left: false,
				_active: false, // true when <= this.state.responsive.at
				_atDefault: undefined, // :int (pixels, get from css media rule max-width)
				/* public
				 *********/
				at: undefined, // :int
				show: false,
				enabled: false,
				dividers: false,
				closeOnClick: true
			}
		};
	}
	connectedCallback() { // :void
		super.connectedCallback && super.connectedCallback();
		if (!this.props.responsive) return false;
		this.__setResponsive(this.props.responsive, false);
	}
	viewReady() {
		super.viewReady && super.viewReady();
		if (!this.isResponsive) return;
		Object.assign(this.rb.elms, {
			nav:     this.shadowRoot.querySelector('nav'),
			menu:    this.shadowRoot.querySelector('.nav'),
			trigger: this.shadowRoot.querySelector('.trigger')
		});
		// in order!
		this.__setResponsiveAts();
		this.__updateCssMedia();
		this._attachResponsiveEvents()
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
			responsive: Object.assign({}, props.any, {
				deserialize(val) {
					val = Type.is.string(val) ? val.trim() : val;
					let newVal = { enabled: true }; // :string (valueless attr)
					switch (true) {
						case /^(?:true|false)$/i.test(val): // :boolean
							newVal.enabled = /^true$/i.test(val);
							break;
						case /^{[^]*}$/.test(val): // :object (options)
							Object.assign(newVal, JSON.parse(val));
							break;
					}
					return newVal;
				}
			})
		}
	}

	/* Getters
	 **********/
	get isResponsive() { // :boolean (readonly)
		if (!this.props.responsive) return false;
		return this.state.responsive.enabled;
	}
	get __cssRules() { // :CSSRuleList (readonly)
		// note: this.shadowRoot.styleSheets (doesn't work in safari)
		return this.shadowRoot.querySelector('style').sheet.cssRules;
	}
	get __viewportWidth() { // :int (covers zooming in on devices, uses clientWidth)
		return Math.max(
			document.documentElement.clientWidth,
			window.innerWidth || 0
		);
	}

	/* Helpers
	 **********/
	__makeNavViewable() { // :void
		if (!this.state.responsive.show) return;
		setTimeout(() => { // (timeout to ensure menu has dimensions)
			const winWidth  = window.innerWidth;
			const menuRect  = this.rb.elms.menu.getBoundingClientRect();
			const menuX     = menuRect.x;
			const menuWidth = menuRect.width;
			let menuTotal = menuX + menuWidth;
			if (this.state.responsive._left)
				menuTotal +=  menuWidth; // _left changes position of menu's x coordinate
			const isNavViewable = winWidth > menuTotal;
			// console.log({ isNavViewable, winWidth, menuTotal, menuWidth, menuX });
			if (isNavViewable) return this.__setResponsive({ _left: false });
			this.__setResponsive({ _left: true });
		});
	}
	__makeNavAboveOtherNavs(isOpen) { // :void (ensures open nav is above other navs)
		if (!Type.is.boolean(isOpen)) return;
		if (isOpen === false) return this.style.zIndex = null;
		const zIndex = parseInt(window.getComputedStyle(this).zIndex);
		if (!Type.is.int(zIndex)) return;
		this.style.zIndex = zIndex + 1;
	}
	__setResponsive(opts={}, triggerUpdate = true) { // :void
		Object.assign(this.state.responsive, opts);
		this.__makeNavAboveOtherNavs(opts.show);
		if (!triggerUpdate) return;
		this.triggerUpdate();
	}
	__setResponsiveAts() { // :void
		let { at, _atDefault } = this.state.responsive;
		const mr = 'max-width: ' // media rule
		const re = new RegExp(`${mr}(\\d*)`);
		for (const rule of this.__cssRules) {
			if (rule.type !== 4) continue; // CSSMediaRule
			const mediaText = rule.media.mediaText; // ex: (max-width: 768px)
			if (!mediaText.includes(mr)) continue;
			_atDefault = parseInt(mediaText.match(re)[1]);
			break;
		}
		this.__setResponsive({ _atDefault });
		if (Type.is.int(at)) return;
		this.__setResponsive({ at: _atDefault });
	}
	__scrollToActive() { // :void
		if (!this.state.responsive.show) return;
		const activeLink = this.rb.elms.links.find(link => link.classList.contains('active'));
		if (!activeLink) return;
		const borderTop = parseInt(getComputedStyle(activeLink).borderTopWidth.slice(0,-2)); // slice removes 'px'
		let scrollTop = activeLink.offsetTop + borderTop; // scroll past top border
		// chrome currently hasn't implemented this but firefox and safari have
		// adjust to new dom spec for retargeting (offsetParent)
		// which means, the offsetParent of a slot elm is the shadowRoot.host (IDKW!)
		if (activeLink.offsetParent === this) scrollTop -= this.rb.elms.menu.offsetTop;
		this.rb.elms.menu.scrollTop = scrollTop;
	}
	__updateCssMedia() { // :void
		const { at, _atDefault } = this.state.responsive;
		if (at === _atDefault) return;
		const mr = 'max-width: ' // media rule
		for (const rule of this.__cssRules) {
			if (rule.type !== 4) continue; // CSSMediaRule
			rule.media.mediaText = rule.media.mediaText.replace(
				`${mr}${_atDefault}`,
				`${mr}${at}`
			);
		}
	}

	/* Popover Helpers
	 ******************/
	__resetPopover(popover) { // :void (clear styles set in __makePopoverViewable())
		const menu    = this.rb.elms.menu;
		const popRoot = popover.shadowRoot.querySelector('.rb-popover');
		menu.style.WebkitOverflowScrolling = null;
		popover.open = false;
		popover.style.minHeight = null;
		popRoot.style.position  = null;
		popRoot.style.zIndex    = null;
		popRoot.style.top       = null;
	}
	__resetPopovers() { // :void
		for (const popover of this.rb.elms.popovers)
			this.__resetPopover(popover);
	}

	/* Event Management
	 *******************/
	_attachResponsiveEvents() { // :void
		this.rb.events.add(this.rb.elms.menu, 'click', this._menuClick);
		this.rb.events.add(window, 'click touchstart', this._windowClick);
		this.rb.events.add(window, 'resize', this._windowResize);
		this.rb.events.add(this, 'popovers-changed', this._attachResponsivePopoverEvents);
		this._windowResize(); // init
	}
	_attachResponsivePopoverEvents(evt) { // :void
		this.rb.events.add(this.rb.elms.popovers, 'open', this._makePopoverViewable);
		this.rb.events.add(this.rb.elms.popovers, 'close', this._resetPopoverOnclose);
	}

	/* Event Handlers
	 *****************/
	_windowClick(evt) { // :void
		if (!this.state.responsive.show) return;
		const path = evt.composedPath();
		if (path.includes(this.rb.elms.nav)) return;
		this.__setResponsive({ show: false });
	}
	_windowResize(evt) { // :void
		if (this.__viewportWidth > this.state.responsive.at) {
			if (this.rb.elms.popovers) this.__resetPopovers();
			return this.__setResponsive({ show: false, _active: false });
		}
		this.__setResponsive({ _active: true });
		this.__makeNavViewable();
	}
	_menuClick(evt) { // :void
		if (this.state.responsive.closeOnClick === false) return;
		const path = evt.composedPath();
		const linkIndex = path.findIndex((elm, i, arr) => { // only close on link click
			return elm.localName === 'a';
		});
		if (linkIndex === -1) return; // not link keep open
		this.__resetPopovers();
		this.__setResponsive({ show: false });
	}
	_triggerLeave(evt) { // :void
		this.rb.elms.trigger.blur();
	}
	_triggerClick(evt) { // :void
		this.__setResponsive({ show: !this.state.responsive.show });
		this.__scrollToActive();
		this.__makeNavViewable();
	}

	/* Popover Event Handlers
	 *************************/
	_makePopoverViewable(evt) { // :void
		if (!this.state.responsive.show) return;
		evt.stopPropagation();
		const popover = evt.currentTarget;
		if (popover !== evt.target) return;
		const menu          = this.rb.elms.menu;
		const popoverRoot   = popover.shadowRoot.querySelector('.rb-popover'); // wrapping root element
		const popoverHeight = popover.offsetHeight;
		const menuBorderTop = parseInt(getComputedStyle(menu).borderTopWidth.slice(0,-2)); // slice removes 'px'
		let popoverRootTop  = (popover.offsetTop + popoverRoot.offsetTop + menuBorderTop) - menu.scrollTop;
		if (popover.offsetParent !== this) popoverRootTop += menu.offsetTop; // see __scrollToActive() for explanation
		// add styles
		menu.style.WebkitOverflowScrolling = 'auto';       // position fixed doesn't work with iOS momentum scroll
		popover.style.minHeight    = `${popoverHeight}px`; // so popover doesn't shrink
		popoverRoot.style.position = 'fixed';              // to break out of nav menu overflow
		popoverRoot.style.zIndex   = 1;                    // for popover inside popover
		popoverRoot.style.top      = `${popoverRootTop}px`;
		// add event
		this.rb.events.add(menu, 'scroll', this.__resetPopovers, { once: true });
	}
	_resetPopoverOnclose(evt) { // :void
		evt.stopPropagation();
		if (evt.currentTarget !== evt.target) return;
		this.__resetPopover(evt.currentTarget);
	}
}

/* Export it!
 *************/
export default Responsive;