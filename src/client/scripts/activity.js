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
		if (active === false)       return false;
		if (active === 'hash')      return 'hash';
		if (active === 'path')      return 'path';
		if (active && active.param) return 'param';
		if (active && typeof active.segment == 'number') return 'segment';
		return true;
	}

	/**********
	 * PRIVATE
	 **********/
	/* Event Management
	 *****************/
	_addEvent(name, method) { // :void
		if (this._events[name]) return this;
		this._events[name] = this._events[name] || this[method].bind(this);
	}
	_detachActivityEvents() { // :void
		if (!this.activity) return this;
		this.removeEventListener('click', this._setActiveClick);
		this._slot.removeEventListener('slotchange', this._events.slotchange);
		this._hashInterval && clearInterval(this._hashInterval);
		this._pathObserver && this._pathObserver.disconnect();
		this._paramsInterval && clearInterval(this._paramsInterval);
		this._segmentObserver && this._segmentObserver.disconnect();
	}
	_attachActivityEvents() { // :void
		if (!this.activity) return this;
		this._addEvent('slotchange', '_slotchange');
		this._slot.addEventListener('slotchange', this._events.slotchange);
	}

	/* Link Helpers
	 ***************/
	__activateLink(link) { // :void
		link.classList.add(ACTIVE_CLASS);
	}
	__deactivateLink(link) { // :void
		if (!this._isActiveLink(link)) return;
		link.classList.remove(ACTIVE_CLASS);
		link.blur(); // remove focus incase :focus and ACTIVE_CLASS are styled same
	}
	__deactivateLinks() { // :void
		for (let link of this.links)
			this.__deactivateLink(link);
	}

	_isActiveLink(link) { // :boolean
		return link.classList.contains(ACTIVE_CLASS);
	}
	_activateLink(link) { // :void
		if (this._isActiveLink(link)) return;
		this.__deactivateLinks();
		this.__activateLink(link);
	}
	_deactivateLinks(deactivate = true) { // :void
		if (deactivate === false) return;
		this.__deactivateLinks();
	}

	/* Event Handlers
	 *****************/
	_slotchange(e) { // :void
		this.addEventListener('click', this._setActiveClick);

		switch(this.activity) {
			case 'hash':
				if (this._hashInterval) break;
				this._setActiveHash(e);
				var oldHash = location.hash;
				this._hashInterval = setInterval(() => {
					let newHash = location.hash;
					if (newHash === oldHash) return;
					oldHash = newHash;
					this._setActiveHash(e);
				}, 100);
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
				}, 100);
				break;

			case 'segment':
				if (this._segmentObserver) break;
				this._setActiveSegment(e);
				var oldSegment = location.pathname;
				this._segmentObserver = new MutationObserver(() => {
					let newSegment = location.pathname;
					if (newSegment === oldSegment) return;
					this._setActiveSegment(e);
					oldSegment = newSegment;
				});
				var opts = { childList: true, subtree: true };
				this._segmentObserver.observe(document.body, opts);
				break;
		}
	}

	_setActiveClick(e) { // :void
		let link = e.composedPath()[0];
		if (link.tagName.toLowerCase() !== 'a') return;
		this._activateLink(link);
	}

	_setActiveHash(e) { // :void
		var locHash = location.hash.split('#')[1];
		locHash = locHash && locHash.toLowerCase();

		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			let linkHash = href.toLowerCase().split('#')[1];
			if (!linkHash) continue;
			if (linkHash !== locHash) continue;
			var deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}

	_setActivePath(e) { // :void (TODO: support hrefs with ..)
		var locPath = location.pathname.toLowerCase();

		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			href = href.toLowerCase().split('?')[0].split('#')[0];
			if (!href) continue;
			if (href !== locPath) continue;
			var deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}

	_setActiveParam(e) { // :void
		var activeParam = this.active.param,
			locQS       = location.search.slice(0),
			locParam    = new URLSearchParams(locQS.toLowerCase()).getAll(activeParam);
		locParam = JSON.stringify(locParam);

		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			let linkQS = href.toLowerCase().split('?')[1];
			if (!linkQS) continue;
			linkQS = linkQS.split('#')[0];
			let linkParam = new URLSearchParams(linkQS).getAll(activeParam);
			if (!linkParam.length) continue;
			linkParam = JSON.stringify(linkParam);
			if (linkParam !== locParam) continue;
			var deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}

	_setActiveSegment(e) { // :void
		var activeSeg = this.active.segment - 1,
			locSegs   = location.pathname.toLowerCase().split('/');
		locSegs.shift();

		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			href = href.toLowerCase().split('?')[0].split('#')[0];
			if (!href) continue;
			let linkSegs = href.toLowerCase().split('/');
			linkSegs.shift();
			if (!linkSegs[0].trim()) continue;
			if (linkSegs.length < activeSeg + 1) continue;
			if (linkSegs[activeSeg] !== locSegs[activeSeg]) continue;
			var deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}
}

/* Export it!
 *************/
export default Activity;