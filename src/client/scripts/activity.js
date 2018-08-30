/******************
 * ACTIVITY MODULE
 ******************/
import { props } from '../../rb-base/scripts/rb-base.js';
const ACTIVE_CLASS = 'active';

const Activity = superClass => class extends superClass {
	/* Lifecycle
	 ************/
	viewReady() {
		super.viewReady && super.viewReady();
		if (!this.props.active) return;
		this._attachActivityEvents()
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		if (!this.props.active) return;
		this._detachActivityEvents();
	}

	/* Properties
	 *************/
	static get props() {
		return {
			...super.props,
			active: Object.assign({}, props.any, {
				default: true,
				deserialize(val) { // :boolean | string | object (val :string)
					val = val.trim();
					let newVal;
					switch (true) {
						case /^(?:hash|path)$/i.test(val):
							newVal = val;
							break;
						case /^(?:true|false)$/i.test(val):
							newVal = /^true$/i.test(val);
							break;
						case /^{[^]*}$/.test(val):
							newVal = JSON.parse(val);
							break;
						default:
							newVal = true;
					}
					// console.log('ACTIVE:', { oldVal: val, newVal });
					return newVal;
				}
			})
		}
	}

	/* Helpers
	 **********/
	__cleanArray(array) { // :[]
		return array.filter(v => {
			if (v === void 0) return false;
			return v !== '';
		});
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

	/* Event Management
	 *******************/
	_attachActivityEvents() { // :void
		this.rb.events.add(this, 'links-changed', this._activateLinks);
		this.rb.events.add(this, 'links-changed', this._setActiveObserver);
	}
	_detachActivityEvents() { // :void
		this._hashInterval && clearInterval(this._hashInterval);
		this._pathObserver && this._pathObserver.disconnect();
		this._paramsInterval && clearInterval(this._paramsInterval);
		this._segmentObserver && this._segmentObserver.disconnect();
	}

	/* Event Handlers
	 *****************/
	_activateLinks(e) { // :void
		this.rb.events.add(this.links, 'click', this._activeLinkClick);
	}
	_setActiveObserver(e) { // :void
		switch(true) {
			case this.active === 'hash':
				if (this._hashInterval) break;
				this._setActiveHash(e);
				let oldHash = location.hash;
				this._hashInterval = setInterval(() => {
					let newHash = location.hash;
					if (newHash === oldHash) return;
					oldHash = newHash;
					this._setActiveHash(e);
				}, 100);
				break;

			case this.active === 'path':
				if (this._pathObserver) break;
				this._setActivePath(e);
				let oldPath = location.pathname;
				this._pathObserver = new MutationObserver(() => {
					let newPath = location.pathname;
					if (newPath === oldPath) return;
					this._setActivePath(e);
					oldPath = newPath;
				});
				this._pathObserver.observe(document.body, {
					childList: true, subtree: true
				});
				break;

			case !!this.active.param:
				if (this._paramsInterval) break;
				this._setActiveParam(e);
				let oldParams = location.search;
				this._paramsInterval = setInterval(() => {
					let newParams = location.search;
					if (newParams === oldParams) return;
					oldParams = newParams;
					this._setActiveParam(e);
				}, 100);
				break;

			case !!this.active.segment:
				if (this._segmentObserver) break;
				this._setActiveSegment(e);
				let oldSegment = location.pathname;
				this._segmentObserver = new MutationObserver(() => {
					let newSegment = location.pathname;
					if (newSegment === oldSegment) return;
					this._setActiveSegment(e);
					oldSegment = newSegment;
				});
				this._segmentObserver.observe(document.body, {
					childList: true, subtree: true
				});
				break;
		}
	}

	/* Link Activity Events
	 ***********************/
	_activeLinkClick(e) { // :void
		this._activateLink(e.currentTarget);
	}
	_setActiveHash(e) { // :void
		let deactivate;
		let locHash = location.hash.split('#')[1];
		locHash = locHash && locHash.toLowerCase();
		for (const link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			const linkHash = href.toLowerCase().split('#')[1];
			if (!linkHash) continue;
			if (linkHash !== locHash) continue;
			deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}
	_setActivePath(e) { // :void (TODO: support hrefs with ..)
		let deactivate;
		const locPath = location.pathname.toLowerCase();
		for (const link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			href = href.toLowerCase().split('?')[0].split('#')[0];
			if (!href) continue;
			if (href !== locPath) continue;
			deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}
	_setActiveParam(e) { // :void
		let deactivate;
		const activeParam = this.active.param;
		const locQS       = location.search.slice(0);
		let locParam = new URLSearchParams(locQS.toLowerCase()).getAll(activeParam);
			locParam = JSON.stringify(locParam);
		for (const link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			let linkQS = href.toLowerCase().split('?')[1];
			if (!linkQS) continue;
			linkQS = linkQS.split('#')[0];
			let linkParam = new URLSearchParams(linkQS).getAll(activeParam);
			if (!linkParam.length) continue;
			linkParam = JSON.stringify(linkParam);
			if (linkParam !== locParam) continue;
			deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}
	_setActiveSegment(e) { // :void
		let deactivate;
		const activeSeg = this.active.segment - 1;
		const locSegs   = this.__cleanArray(location.pathname.toLowerCase().split('/'));
		for (const link of this.links) {
			let href = link.getAttribute('href');
			if (!href) continue;
			href = href.toLowerCase().split('?')[0].split('#')[0];
			if (!href) continue;
			const linkSegs = this.__cleanArray(href.split('/'));
			if (linkSegs[activeSeg] !== locSegs[activeSeg]) continue;
			deactivate = false;
			this._activateLink(link);
			break;
		}
		this._deactivateLinks(deactivate);
	}
}

/* Export it!
 *************/
export default Activity;