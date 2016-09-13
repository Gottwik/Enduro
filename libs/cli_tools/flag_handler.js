// * ———————————————————————————————————————————————————————— * //
// * 	flag handler
// *	creates an object based on flags provided
// * ———————————————————————————————————————————————————————— * //
var flag_handler = function () {}

// local variables
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// constants
var FLAG_MAP = {
	f: {
		label: 'force',
		message: 'Force flag - weird stuff might happen'
	},
	nr: {
		label: 'norefresh',
		message: 'Will not open browser tab on first run',
	},
	nowatch: {
		label: 'nowatch',
		message: 'Will not watch static files and refresh for changes'
	},
	nocmswatch: {
		label: 'nocmswatch',
		message: 'No CMS watch flag - will not refresh on cms changes'
	},
	noadmin: {
		label: 'noadmin',
		message: 'No admin flag - no admin on port 5000 is running'
	},
	debug: {
		label: 'debug',
		message: 'will log out everything'
	},
}

// * ———————————————————————————————————————————————————————— * //
// * 	get flag object
// * 	generates object based on flag array
// *
// *	@return {object} - object containing all the flags
// * ———————————————————————————————————————————————————————— * //
flag_handler.prototype.get_flag_object = function (flags) {

	var flag_object = {}

	for (i in flags) {
		if (FLAG_MAP[flags[i]]) {
			flag_object[FLAG_MAP[flags[i]]['label']] = true
			kiska_logger.err(FLAG_MAP[flags[i]]['message'])
		}
	}

	return flag_object
}

flag_handler.prototype.list_flags = function () {
	kiska_logger.init('available flags')

	var first = true
	for (f in FLAG_MAP) {
		!first && kiska_logger.line()
		kiska_logger.log('-' + f + ': ' + FLAG_MAP[f].label)
		kiska_logger.log(FLAG_MAP[f].message)

		first = false
	}

	kiska_logger.end()
}

module.exports = new flag_handler()
