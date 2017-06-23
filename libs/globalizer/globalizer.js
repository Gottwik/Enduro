// * ———————————————————————————————————————————————————————— * //
// * 	globalizer
// *
// *	enables '@statuses:0@' notation in js files and thus enabling connecting js cms files
// * ———————————————————————————————————————————————————————— * //
var globalizer_handler = function () {}

// local dependencies
var globalizer_helpers = require(enduro.enduro_path + '/libs/globalizer/globalizer_helpers')

// decides whether control object is a globalizer
function is_globalizer (content_object) {
	return content_object && content_object.substring && (content_object.substring(0, 2) == '@@' || content_object.substring(0, 3) == '!@')
}

// decides whether globalizer is is_shallow
function is_shallow (content_object) {
	return content_object && content_object.substring && (content_object.substring(0, 3) == '!@')
}

// recursive function that injects the linked controls
function globalize (context, root_context) {

	// can't globalizer if context is not an object(string, true/false)
	if (typeof context != 'object') {
		return
	}

	// goes through the context
	for (key in context) {

		// stores whether object is a shallow globalizer
		var is_object_shallow_globalizer = is_shallow(context[key])
		if (typeof context[key] !== 'function' && is_globalizer(context[key])) {

			// fetches the context behind the link
			var routed_context = globalizer_helpers.route_context(root_context, context[key])

			// replaces the globalizer string with the fetched object
			context[key] = routed_context
		}

		// don't go deeper if it was a shallow globalizer
		if (!is_object_shallow_globalizer) {

			// runs the globalizer on the recently added object
			globalize(context[key], root_context)
		}
	}
}

// publicly accessible function that starts the recursive linking
globalizer_handler.prototype.globalize = function (context) {
	globalize(context, context)
}

module.exports = new globalizer_handler()
