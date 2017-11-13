// global dependencies
const inquirer = require('inquirer')

// * enduro dependencies
const enduro_instance = require('../../index').quick_init()
const enduro_configurator = require(enduro.enduro_path + '/libs/configuration/enduro_configurator')
const logger = require(enduro.enduro_path + '/libs/logger')

module.exports = {
	command: 'juicebox',
	desc: 'turns juicebox off and on',
	builder: (yargs) => {
		return yargs
			.usage('enduro juice juicebox')
	},
	handler: function (cli_arguments) {
		logger.init('setting up juicebox')

		let turning_on = true

		enduro_configurator.read_config()
			.then((config) => {
				if (config.juicebox_enabled) {
					turning_on = false
					return inquirer.prompt([
						{
							name: 'juicebox_enabled',
							message: 'Juicebox enabled, do you want to disable it?',
							type: 'confirm',
							default: true,
						},
					])
				} else {
					turning_on = true
					return inquirer.prompt([
						{
							name: 'juicebox_enabled',
							message: 'Juicebox disabled, do you want to enable it?',
							type: 'confirm',
							default: true,
						},
					])
				}
			})
			.then((answers) => {
				if (!turning_on) {
					answers.juicebox_enabled = !answers.juicebox_enabled
				}
				turning_on = answers.juicebox_enabled
				return enduro_configurator.set_config(answers)
			})
			.then(() => {
				logger.line()
				if (turning_on) {
					logger.log('Juicebox enabled successfully')
				} else {
					logger.log('Juicebox disabled successfully')
				}
				logger.end()
			})
	}
}
