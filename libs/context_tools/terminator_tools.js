// * ———————————————————————————————————————————————————————— * //
// * 	terminator tools
// * 	offer tools to manipulat terminations
// * ———————————————————————————————————————————————————————— * //
const terminator_tools = function () {}

// publicly accessible function that starts the recursive linking
terminator_tools.prototype.get_terminator = function (context_key) {
	if (context_key[0] != '$') {
		return false
	}
	
	const match = context_key.match(/\$[^_]*_(.*)/)
	if (match && match[1]) {
		return match[1]
	}

	return false
}

terminator_tools.prototype.replace_terminator = function (context_key, replacement_terminator) {
	return context_key.replace(/(\$[^_]*_)(.*)/, '$1' + replacement_terminator)
}

module.exports = new terminator_tools()
