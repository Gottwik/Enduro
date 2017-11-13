// * ———————————————————————————————————————————————————————— * //
// * 	project configurator
// *	reads the configuration file and sets the variables
// * ———————————————————————————————————————————————————————— * //
const enduro_configurator = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const extend = require('extend')
const path = require('path')
const fs = Promise.promisifyAll(require('fs-extra'))

// * enduro dependencies
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const default_configuration = require(enduro.enduro_path + '/libs/configuration/enduro_default_configuration.js')

// * ———————————————————————————————————————————————————————— * //
// * 	read configurtion file
// *
// *	@return {promise} - empty promise
// * ———————————————————————————————————————————————————————— * //
enduro_configurator.prototype.read_config = function () {

	const CONFIG_PATH = enduro.project_path + '/enduro.json'
	const SECRET_CONFIG_PATH = enduro.project_path + '/enduro_secret.json'

	return Promise.all([
		read_config_file(CONFIG_PATH, default_configuration.default_configuration),
		read_config_file(SECRET_CONFIG_PATH, default_configuration.default_secret_configuration)
	])
		.then(() => {

			// abstract/edit the just read configuration

			enduro.config.variables = {}
			enduro.config.variables.has_s3_setup = enduro.config.secret && enduro.config.secret.s3
			enduro.config.variables.S3_KEY = (enduro.config.variables.has_s3_setup && enduro.config.secret.s3.S3_KEY) || process.env.S3_KEY
			enduro.config.variables.S3_SECRET = (enduro.config.variables.has_s3_setup && enduro.config.secret.s3.S3_SECRET) || process.env.S3_SECRET

			enduro.config.variables.s3_enabled = (enduro.config.project_name && enduro.config.variables.S3_KEY && enduro.config.variables.S3_SECRET)

			// disable juicebox if there is nojuice flag
			if (enduro.flags.nojuice) {
				enduro.config.juicebox_enabled = false
			}

			// force enable meta context in cms files if juicebox is juicebox_enabled
			// juicebox is dependant on having time edited in the meta
			if (enduro.config.juicebox_enabled) {
				enduro.config.meta_context_enabled = true
			}

			// preselect s3 as remote filesystem once aws keys are inputted
			if (enduro.config.variables.s3_enabled) {
				enduro.config.filesystem = 's3'
			}

			// add empty culture that will always render the pages without any culture in the primary culture
			enduro.config.cultures.push('')

			return Promise.resolve(enduro.config)
		})
}

function read_config_file (config_file, default_config) {

	// check if file exists
	if (!flat_helpers.file_exists_sync(config_file)) {

		// uses default config if no configuration is specified
		enduro.config = extend(true, enduro.config, default_config)
		return new Promise.resolve()
	} else {

		// Reads the configuration file
		return fs.readFileAsync(config_file)
			.then((data) => {
				// Parses json file
				local_config = JSON.parse(data)

				// Extend loaded file with default configuration
				enduro.config = extend(true, enduro.config, default_config, local_config)
			})
	}
}

// this will extend current enduro.json config file with updated context
enduro_configurator.prototype.set_config = function (new_setup) {

	secret_setup = { secret: new_setup.secret }
	delete new_setup.secret

	// stores config paths
	const config_path = path.join(enduro.project_path, 'enduro.json')
	const secret_config_path = path.join(enduro.project_path, 'enduro_secret.json')

	// extends public config variable
	extend(true, enduro.config, new_setup)

	// extends and saves public config file
	const extend_public_config = extend_config(config_path, new_setup)
	const extend_secret_config = extend_config(secret_config_path, secret_setup)

	return Promise.all([
		extend_public_config,
		extend_secret_config
	])
}

function extend_config (path, setup) {
	return fs.readJsonAsync(path)
		.then((data) => {
			extend(true, data, setup)
			return data
		}, () => {
			return setup
		})
		.then((config) => {
			return fs.outputJsonAsync(path, config, { spaces: '\t' })
		})
}

module.exports = new enduro_configurator()
