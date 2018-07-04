/*************************************************
 * EVENT SERVICE
 *************************************************
 * How To Use (import then call in constructor):
 - import EventService from './event-service.js';
 - this.rbEvent = EventService.call(this);
 *************************************************/
import { emit } from '../../../skatejs/dist/esnext/emit.js';

const Helpers = {
	handleEventListener(action, target, event, callback) { // :void
		action = action === 'add' ? 'addEventListener' : 'removeEventListener';
		if (!Array.isArray(target)) return target[action](event, callback);
		for (const elm of target) elm[action](event, callback);
	}
}

const EventService = function() { // :{} (this = consumer's module)
	/* Private
	 **********/
	const Events = {};

	/* Public
	 *********/
	return {
		add: (target, namespace, event, cbName) => { // :void
			if (!Events[namespace]) Events[namespace] = {};
			if (!Events[namespace][cbName]) // bind to module
				Events[namespace][cbName] =
					target === this ? this[cbName] : this[cbName].bind(this);
			const callback = Events[namespace][cbName];
			Helpers.handleEventListener('add', target, event, callback);
			// console.log(Events)
		},
		remove: (target, namespace, event, cbName) => { // :void
			if (!Events[namespace]) return;
			if (!Events[namespace][cbName]) return;
			const callback = Events[namespace][cbName];
			delete Events[namespace][cbName];
			if (!Object.keys(Events[namespace]).length) delete Events[namespace];
			Helpers.handleEventListener('remove', target, event, callback);
			// console.log(Events)
		},
		emit: (target, event, opts={}) => { // :boolean
			return emit(target, event, opts); // returns elm.dispatchEvent(e)
		}
	};
};

/* Export it!
 *************/
export default EventService;