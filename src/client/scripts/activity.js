/******************
 * ACTIVITY MODULE
 ******************/
const ACTIVE_CLASS = 'active';
const Activity = superClass => class extends superClass {
	disconnectedCallback() {
		super.disconnectedCallback();
		this.detachActivityEvents();
	}

	/*************
	 * PUBLIC API
	 *************/
	// Properties
 	static get properties() {
 		return {
 			active: {
				type: String, // :boolean | string | object
 				value: true
 			},
			activity: {
				type: String,
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

	getActivity(active) { // :string (activity type)
		switch(active) {
			case 'false': active = false;  break;
			case 'hash':  active = 'hash'; break;
			case 'path':  active = 'path'; break;
			default:      active = 'default';
		}
		return active;
	}

	// Event Handling
	detachActivityEvents() { // :this
		if (!this.activity) return this;
		this.removeEventListener('click', this._setActive);
		if (this.activity === 'hash')
			window.removeEventListener('hashchange', this._setActiveHash);
		return this;
	}

	attachActivityEvents() { // :this
		if (!this.activity) return this;
		this.addEventListener('click', this._setActive);
		return this;
	}

	// Methods
	setActivity() { // :this
		if (!this.activity) return this;
		this._slot.addEventListener('slotchange', e => {
			switch(this.activity) {
				case 'hash':
					this._setActiveHash(e);
					this._setActiveHash = this._setActiveHash.bind(this);
					window.addEventListener('hashchange', this._setActiveHash);
					break;
			}
		})
		return this;
	}

	/**********
	 * PRIVATE
	 **********/
	// Helpers
	_activateLink(link) { // :void
		link.classList.add(ACTIVE_CLASS);
	}
	_deactivateLink(link) { // :void
		if (!this._isActiveLink(link)) return;
		link.classList.remove(ACTIVE_CLASS);
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
	_setActiveHash(e) { // :void
		var hash = location.hash;
		if (!hash) return;
		for (let link of this.links) {
			let href = link.getAttribute('href');
			if (!href || !href.includes(hash)) continue;
			this._deactivateLinks();
			this._activateLink(link);
			break;
		}
	}

	_setActive(e) { // :void
		if (!this.links.length) return this;
		let link = e.composedPath()[0];
		if (link.tagName.toLowerCase() !== 'a') return;
		if (this._isActiveLink(link)) return;
		this._deactivateLinks();
		this._activateLink(link);
	}

}

export default Activity;