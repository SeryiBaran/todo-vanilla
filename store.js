/*
Based on "Go Make Things" solution.
Added `eventHandler`.

https://gomakethings.com/simple-reactive-data-stores-with-vanilla-javascript-and-proxies/
*/

export function store(data = {}, name = "store", eventHandler = () => {}) {
	/**
	 * Emit a custom event
	 * @param  {String} type   The event type
	 * @param  {*}      detail Any details to pass along with the event
	 */
	function emit(type, detail) {
		// Create a new event
		let event = new CustomEvent(type, {
			bubbles: true,
			cancelable: true,
			detail: detail,
		});

		// Dispatch the event
		return document.dispatchEvent(event);
	}

	/**
	 * Create the Proxy handler object
	 * @param  {String} name The namespace
	 * @param  {Object} data The data object
	 * @return {Object}      The Proxy handler
	 */
	function handler(name, data) {
		return {
			get: function (obj, prop) {
				if (prop === "_isProxy") return true;
				if (
					["object", "array"].includes(
						Object.prototype.toString
							.call(obj[prop])
							.slice(8, -1)
							.toLowerCase()
					) &&
					!obj[prop]._isProxy
				) {
					obj[prop] = new Proxy(obj[prop], handler(name, data));
				}
				return obj[prop];
			},
			set: function (obj, prop, value) {
				if (obj[prop] === value) return true;
				obj[prop] = value;
				emit(name, data);
				eventHandler();
				return true;
			},
			deleteProperty: function (obj, prop) {
				delete obj[prop];
				emit(name, data);
				return true;
			},
		};
	}

	return new Proxy(data, handler(name, data));
}
