/******************
 * ACTIVITY MODULE
 ******************/
const ACTIVE_CLASS = 'active';

const Activity = superClass => class extends superClass {
	constructor() {
		super();
		this._events = {};
	}
	connectedCallback() {
		super.connectedCallback();
		if (!this._slot) this._slot = this.root.querySelector('slot');
		this._attachActivityEvents()
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this._detachActivityEvents();
	}

	/*************
	 * PUBLIC API
	 *************/
	// Properties
 	static get properties() {
 		return {
 			active: {
				type: Object, // :boolean | string | object
 				value: true
 			},
			activity: {
				type: Object, // :boolean | string
				readOnly: true,
				computed: 'getActivity(active)'
			},
			activeClass: {
				type: String,
				readOnly: true,
 				value: ACTIVE_CLASS
 			}
 		}
 	}

	getActivity(active) { // :boolean | string (activity type)
		if (active === false)         return false;
		if (active === 'hash')        return 'hash';
		if (active === 'path')        return 'path';
		if (active && active.param)   return 'param';
		if (active && active.segment) return 'segment';
		return true;
	}

	/**********
	 * PRIVATE
	 **********/
	// Event Handling
	_addEvent(name, method) { // :void
		if (this._events[name]) return this;
		this._events[name] = this._events[name] || this[method].bind(this);
	}
	_detachActivityEvents() { // :void
		if (!this.activity) return this;
		this.removeEventListener('click', this._setActiveClick);
		this._slot.removeEventListener('slotchange', this._events.slotchange);
		window.removeEventListener('hashchange', this._events.hashchange);
		this._pathObserver && this._pathObserver.disconnect();
		this._paramsInterval && clearInterval(this._paramsInterval);
	}
	_attachActivityEvents() { // :void
		if (!this.activity) return this;
		this._addEvent('slotchange', '_slotchange');
		this._slot.addEventListener('slotchange', this._events.slotchange);
	}

	// Link Helpers
	_activateLink(link) { // :void
		link.classList.add(ACTIVE_CLASS);
	}
	_deactivateLink(link) { // :void
		if (!this._isActiveLink(link)) return;
		link.classList.remove(ACTIVE_CLASS);
		link.blur(); // remove focus incase :focus and ACTIVE_CLASS are styled same
	}
	_deactivateLinks() { // :void
		for (let link of this.links) {
			this._deactivateLink(link);
		}
	}
	_isActiveLink(link) { // :boolean
		return link.classList.contains(ACTIVE_CLASS);
	}

	// Event Handlers
	_slotchange(e) { // :void
		this.addEventListener('click', this._setActiveClick);

		switch(this.activity) {
			case 'hash':
				this._setActiveHash(e);
				this._addEvent('hashchange', '_setActiveHash');
				window.addEventListener('hashchange', this._events.hashchange);
				break;

			case 'path':
				if (this._pathObserver) break;
				this._setActivePath(e);
				var oldPath = location.pathname;
				this._pathObserver = new MutationObserver(() => {
					let newPath = location.pathname;
					if (newPath === oldPath) return;
					this._setActivePath(e);
					oldPath = newPath;
				});
				var opts = { childList: true, subtree: true };
				this._pathObserver.observe(document.body, opts);
				break;

			case 'param':
				if (this._paramsInterval) break;
				this._setActiveParam(e);
				var oldParams = location.search;
				this._paramsInterval = setInterval(() => {
					let newParams = location.search;
					if (newParams === oldParams) return;
					oldParams = newParams;
					this._setActiveParam(e);
				}, 250);
				break;
		}
	}

	_setActiveClick(e) { // :void
		let link = e.composedPath()[0];
		if (link.tagName.toLowerCase() !== 'a') return;
		if (this._isActiveLink(link)) return;
		this._deactivateLinks();
		this._activateLink(link);
	}

	_setActiveHash(e) { // :void
		var hash = location.hash;
		if (!hash) return;
		hash = hash.toLowerCase();
		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href || !href.toLowerCase().includes(hash)) continue;
			if (this._isActiveLink(link)) return;
			this._deactivateLinks();
			this._activateLink(link);
			break;
		}
	}

	_setActivePath(e) { // :void (TODO: support hrefs with ..)
		var path = location.pathname.toLowerCase();
		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			href = href.toLowerCase().split('?')[0].split('#')[0];
			if (!href.includes(path)) continue;
			if (this._isActiveLink(link)) return;
			this._deactivateLinks();
			this._activateLink(link);
			break;
		}
	}

	_setActiveParam(e) { // :void
		var locQS = location.search.slice(0);
		if (!locQS) return;
		locQS = locQS.toLowerCase();
		var locParam = new URLSearchParams(locQS).getAll(this.active.param);
		if (!locParam.length) return;
		locParam = JSON.stringify(locParam);

		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			let linkQS = href.toLowerCase().split('?')[1];
			if (!linkQS) continue;
			linkQS = linkQS.split('#')[0];
			let linkParam = new URLSearchParams(linkQS).getAll(this.active.param);
			if (!linkParam.length) continue;
			linkParam = JSON.stringify(linkParam);
			if (linkParam != locParam) continue;
			if (this._isActiveLink(link)) return;
			this._deactivateLinks();
			this._activateLink(link);
			break;
		}
	}
}

/* Export it!
 *************/
export default Activity;