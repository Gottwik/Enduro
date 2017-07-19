// * ———————————————————————————————————————————————————————— * //
// * 	globalizer helpers
// * ———————————————————————————————————————————————————————— * //
var globalizer_handler = function () {}

// * ———————————————————————————————————————————————————————— * //
// * 	route context
// *
// *	example:
// *		for globalizer string: '@@toys.duplo'
// *		and object
// *
// *		{
// *			toys: {
// *				duplo: 'lego for babies'
// *			}
// *		}
// *
// *		returns 'lego for babies'
// *
// *
// *	@param {object} context - object to be searched against the globalize string
// *	@param {string} globalizer_string - string that starts with @@ or @!
// *	@return {object or value} - whatever value is found at the route set by globalizer
// * ———————————————————————————————————————————————————————— * //
globalizer_handler.prototype.route_context = function (context, globalizer_string) {
	return globalizer_string
		.substring(2)
		.split('.')
		.reduce((prev, next) => {
			if (Array.isArray(prev)) {
				for (i in prev) {
					if (prev[i][Object.keys(prev[i])[0]] == next) {
						return prev[i]
					}
				}
				return ''
			} else if (typeof prev === 'object' && next in prev) {
				return prev[next]
			} else {
				// key not found in object
				return ''
			}
		}, context)
}

module.exports = new globalizer_handler()
