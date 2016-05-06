// * ———————————————————————————————————————————————————————— * //
// * 	Project configurator
// *	reads the configuration file and sets the variables
// * ———————————————————————————————————————————————————————— * //

var enduro_configurator = function () {}

var CONFIG_PATH = CMD_FOLDER + '/enduro.json'

var fs = require('fs')
var extend = require('extend')

var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

var default_config = {
	project_name: 'Enduro project',
	project_slug: 'en'
}

enduro_configurator.prototype.read_config = function() {
	return new Promise(function(resolve, reject){

		// check if file exists
		if(!enduro_helpers.fileExists(CONFIG_PATH)) {
			resolve()
		}

		fs.readFile(CONFIG_PATH, function read(err, data) {
			if(err) { return kiskaLogger.err(err); }

			local_config = JSON.parse(data)

			config = extend(true, default_config, local_config)

			resolve()
		});

	})
}

module.exports = new enduro_configurator()