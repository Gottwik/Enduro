// * ———————————————————————————————————————————————————————— * //
// * 	project configurator
// *	reads the configuration file and sets the variables
// * ———————————————————————————————————————————————————————— * //
var enduro_configurator = function () {}

// vendor dependencies
var fs = require('fs')
var extend = require('extend')
var path = require('path')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var default_configuration = require(enduro.enduro_path + '/libs/configuration/enduro_default_configuration.js')

// * ———————————————————————————————————————————————————————— * //
// * 	read configurtion file
// *
// *	@return {promise} - empty promise
// * ———————————————————————————————————————————————————————— * //
enduro_configurator.prototype.read_config = function () {

	var CONFIG_PATH = enduro.project_path + '/enduro.json'
	var SECRET_CONFIG_PATH = enduro.project_path + '/enduro_secret.json'

	return Promise.all([
		read_config_file(CONFIG_PATH, default_configuration.default_configuration),
		read_config_file(SECRET_CONFIG_PATH, default_configuration.default_secret_configuration)
	])
	.then(() => {
		enduro.config.variables = {}
		enduro.config.variables.S3_KEY = (enduro.config.secret && enduro.config.secret.s3 && enduro.config.secret.s3.S3_KEY) || process.env.S3_KEY
		enduro.config.variables.S3_SECRET = (enduro.config.secret && enduro.config.secret.s3 && enduro.config.secret.s3.S3_SECRET) || process.env.S3_SECRET

		enduro.config.variables.s3_enabled = (enduro.config.project_name && enduro.config.variables.S3_KEY && enduro.config.variables.S3_SECRET)

		// will enable juicebox as soon as user inputs s3 keys
		if (enduro.config.variables.s3_enabled) {
			enduro.config.filesystem = 's3'
		}

		return Promise.resolve()
	})
}

function read_config_file (config_file, default_config) {
	return new Promise(function (resolve, reject) {

		// check if file exists
		if (!flat_helpers.file_exists_sync(config_file)) {

			// uses default config if no configuration is specified
			enduro.config = extend(true, enduro.config, default_config)
			resolve()
		} else {

			// Reads the configuration file
			fs.readFile(config_file, function read (err, data) {
				if (err) {
					logger.err_block(err)
					return reject()
				}

				// Parses json file
				local_config = JSON.parse(data)
				// Extend loaded file with default configuration
				enduro.config = extend(true, enduro.config, default_config, local_config)

				resolve()
			})
		}
	})
}

module.exports = new enduro_configurator()
