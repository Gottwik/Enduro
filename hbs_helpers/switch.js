// * ———————————————————————————————————————————————————————— * //
// *    switch helper
// *	provides switch functionality with inline arguments
// *	usage:
// *
// *	{{switch small '5px' medium '10px' large '20px'}}
// *
// *	returns last value as default
// *
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('switch', function () {

		// create a list out of arguments
		var arguments_list = []
		for (var i in arguments) {
			arguments_list.push(arguments[i])
		}

		// remove last element - which is the whole context
		arguments_list = arguments_list.slice(0, -1)

		// check even argumens and return respective odd argument
		for (i = 0; i < Math.floor(arguments_list.length / 2); i++) {
			if (arguments_list[i * 2]) {
				return arguments_list[i * 2 + 1]
			}
		}

		// return last provided argument as a default value
		return arguments_list.slice(-1)[0]
	})
}

module.exports = new helper()
