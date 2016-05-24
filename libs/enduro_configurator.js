// * ———————————————————————————————————————————————————————— * //
// * 	project configurator
// *	reads the configuration file and sets the variables
// * ———————————————————————————————————————————————————————— * //
var enduro_configurator = function () {}

// vendor dependencies
var fs = require('fs')
var extend = require('extend')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')

// constants
var CONFIG_PATH = CMD_FOLDER + '/enduro.json'
var SECRET_CONFIG_PATH = CMD_FOLDER + '/enduro_secret.json'

// default public config
var public_default_config = {
	project_name: 'Enduro project',
	project_slug: 'en',
	render_templates: true
}

var secret_default_config = {}


// * ———————————————————————————————————————————————————————— * //
// * 	read configurtion file
// *
// *	@return {promise} - empty promise
// * ———————————————————————————————————————————————————————— * //
enduro_configurator.prototype.read_config = function() {
	return Promise.all([
		read_config_file(CONFIG_PATH, public_default_config),
		read_config_file(SECRET_CONFIG_PATH, secret_default_config)
	])
}


function read_config_file(config_file, default_config) {
	return new Promise(function(resolve, reject){

		// check if file exists
		if(!enduro_helpers.fileExists(config_file)) {

			// uses default config if no configuration is specified
			global.config = default_config
			resolve()
		} else {

			// Reads the configuration file
			fs.readFile(config_file, function read(err, data) {
				if(err) {
					kiska_logger.err_block(err)
					return reject()
				}

				// Parses json file
				local_config = JSON.parse(data)
				// Extend loaded file with default configuration
				global.config = extend(true, config, default_config, local_config)

				resolve()
			})
		}
	})
}

module.exports = new enduro_configurator()