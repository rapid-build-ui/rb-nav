/********************
 * RESPONSIVE MODULE
 ********************/
import { props } from '../../../../rb-base/scripts/rb-base.js';
import Type      from '../../../../rb-base/scripts/public/services/type.js';

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
	__setResponsive(opts={}, triggerUpdate = true) { // :void
		Object.assign(this.state.responsive, opts);
		// console.log('set responsive:',  this.state.responsive);
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
		this.rb.elms.menu.scrollTop = activeLink.offsetTop + borderTop; // (scroll past top border)
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

	/* Event Management
	 *******************/
	_attachResponsiveEvents() { // :void
		this.rb.events.add(this.rb.elms.menu, 'click', this._menuClick);
		this.rb.events.add(window, 'click touchstart', this._windowClick);
		this.rb.events.add(window, 'resize', this._windowResize);
		this._windowResize(); // init
	}

	/* Event Handlers
	 *****************/
	_windowClick(e) { // :void
		if (!this.state.responsive.show) return;
		const path = e.composedPath();
		if (path.includes(this.rb.elms.nav)) return;
		this.__setResponsive({ show: false });
	}
	_windowResize(e) { // :void
		if (this.__viewportWidth > this.state.responsive.at)
			return this.__setResponsive({ show: false, _active: false });
		this.__setResponsive({ _active: true });
		this.__makeNavViewable();
	}
	_menuClick(e) { // :void
		if (this.state.responsive.closeOnClick === false) return;
		const path = e.composedPath();
		const h3Index = path.findIndex((elm, i, arr) => { // don't close when clicking on h3
			if (elm.localName !== 'h3') return false;
			return arr[i+1].localName === 'slot'; // slot will be next elm
		}); if (h3Index !== -1) return;
		this.__setResponsive({ show: false });
	}
	_triggerLeave(e) { // :void
		this.rb.elms.trigger.blur();
	}
	_triggerClick(e) { // :void
		this.__setResponsive({ show: !this.state.responsive.show });
		this.__scrollToActive();
		this.__makeNavViewable();
	}
}

/* Export it!
 *************/
export default Responsive;