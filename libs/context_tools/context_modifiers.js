// * ———————————————————————————————————————————————————————— * //
// * 	context modifier
// *	provides tools to make modifying cms context simple
// * ———————————————————————————————————————————————————————— * //
const context_modifiers = function () {}

const terminator_tools = require(enduro.enduro_path + '/libs/context_tools/terminator_tools')

// * ———————————————————————————————————————————————————————— * //
// * 	add sibling object for each cms object of certain type
// * ———————————————————————————————————————————————————————— * //
context_modifiers.prototype.add_sibling_to_type = function (context, type_to_search_for, added_termination, value) {
	
	const self = this

	for (key in context) {

		if (typeof context[key] === 'object') {
			context[key] = self.add_sibling_to_type(context[key], type_to_search_for, added_termination, value)
			continue
		}

		const terminator = terminator_tools.get_terminator(key)
		if (terminator == 'type' && context[key] == type_to_search_for) {
			context[terminator_tools.replace_terminator(key, added_termination)] = value
		}
	}

	return context
}

module.exports = new context_modifiers()
