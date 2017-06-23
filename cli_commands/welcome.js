module.exports = {
	command: 'welcome',
	aliases: ['*'],
	desc: 'prints out welcome message',
	handler: function (cli_arguments) {

		var enduro_instance = require('../index').quick_init()
		var logger = require(enduro.enduro_path + '/libs/logger')

		var chalk = require('chalk')

		if (!cli_arguments._.length) {
			logger.init('enduro.js')
			logger.centerlog('Welcome to enduro.js :-)', true)

			logger.log('Want to create a new enduro.js project from a theme?')
			logger.tablog('run ' + chalk.green('$ enduro theme'), true)

			logger.log('Want to create a new, empty enduro.js project?')
			logger.tablog('run ' + chalk.green('$ enduro create'), true)

			logger.log('Do you already have a enduro.js project?')
			logger.tablog('run ' + chalk.green('$ enduro dev') + ' to start developing it', true)

			logger.log('Project finished?')
			logger.tablog('run ' + chalk.green('$ enduro start') + ' to start production mode', true)

			logger.log('Documentation?')
			logger.tablog('Sure: ' + chalk.green('www.endurojs.com/docs'))

			logger.end()
			// unknown command
		} else {
			logger.init('ooops')
			logger.log('\'' + cli_arguments._.join(' ') + '\' is not a valid command')
			logger.tablog('try running: ' + chalk.green('$ enduro -h') + ' to discover valid commands')
			logger.end()
			// no command
		}
	}
}
