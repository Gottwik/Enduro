// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.install
// * ———————————————————————————————————————————————————————— * //

const action = function () {}

// * vendor dependencies
const npm = require('npm')
const path = require('path')
const Promise = require('bluebird')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')
const enduro_configurator = require(enduro.enduro_path + '/libs/configuration/enduro_configurator')

action.prototype.action = function (brick_name) {

	logger.init(`installing ${brick_name}`)
	return install_brick_via_npm(brick_name)
		.then((install_response) => {
			return add_brick_settings(install_response)
		})
		.then(() => {
			logger.end()
		})
	
}

function install_brick_via_npm (brick_name) {
	return new Promise(function (resolve, reject) {
		// workaround to make npm silent
		const log_temp = console.log
		console.log = function () {}

		logger.loading('starting npm')
		// so first, lets install the brick with npm
		npm.load({
			loaded: false,
			progress: false,
			loglevel: 'error',
		}, () => {

			npm.commands.install('', [brick_name], function (err, installed_modules) {
				if (err) { logger.raw_err(err) }

				// turns on logging again
				console.log = log_temp
				logger.loaded()
				logger.log(`${brick_name} installed successfully`)
				resolve({
					brick_name: brick_name,
					installed_modules: installed_modules,
				})
			})
		})
	})
}

function add_brick_settings (install_response) {

	// try to get default settings
	const path_to_brick = install_response.installed_modules[0][1]

	const module = require(path_to_brick)

	return enduro_configurator.set_config({
		bricks: {
			[install_response.brick_name]: module.brick_configuration.default_settings || {},
		}
	})
}

module.exports = new action()
