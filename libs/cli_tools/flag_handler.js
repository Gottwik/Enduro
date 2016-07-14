// * ———————————————————————————————————————————————————————— * //
// * 	flag handler
// *	creates an object based on flags provided
// * ———————————————————————————————————————————————————————— * //
var flag_handler = function () {}

// local variables
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// constants
var FLAG_MAP =  {
	f: {
		label: 'force',
		message: 'Force flag - weird stuff might happen'
	},
	nr: {
		label: 'norefresh',
		message: '',
	},
	nojswatch: {
		label: 'nojswatch',
		message: 'No javascript watch flag - will to refresh on js changes'
	},
	nocmswatch: {
		label: 'nocmswatch',
		message: 'No CMS watch flag - will to refresh on cms changes'
	},
	noadmin: {
		label: 'noadmin',
		message: 'No admin flag - no admin on port 5000 is running'
	}
}

// * ———————————————————————————————————————————————————————— * //
// * 	get flag object
// * 	generates object based on flag array
// *
// *	@return {object} - object containing all the flags
// * ———————————————————————————————————————————————————————— * //
flag_handler.prototype.get_flag_object = function(flags) {

	var flag_object = {}

	for(i in flags) {
		if(FLAG_MAP[flags[i]]) {
			flag_object[FLAG_MAP[flags[i]]['label']] = true
			kiska_logger.err(FLAG_MAP[flags[i]]['message'])
		}
	}

	return flag_object
}

module.exports = new flag_handler()