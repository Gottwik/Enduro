// * ———————————————————————————————————————————————————————— * //
// * 	globalizer
// *
// *	enables '@statuses:0@' notation in js files and thus enabling connecting js cms files
// * ———————————————————————————————————————————————————————— * //
var globalizer_handler = function () {}

// local dependencies

function globalize (context, root_context) {
	if (typeof (context) != 'object') {
		return
	}

	for (key in context) {
		if (context[key].substring && context[key].substring(0, 2) == '@@') {

			var routed_context = context[key].substring(2).split('.').reduce((prev, next) => {
				return prev[next]
			}, root_context)

			context[key] = routed_context
		}
		globalize(context[key], root_context)
	}
}

globalizer_handler.prototype.globalize = function (context) {
	globalize(context, context)
}

module.exports = new globalizer_handler()
