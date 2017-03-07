#!/usr/bin/env node

global.program = require('yargs')
	.commandDir('cli_commands')
	.version(require('./package.json').version)
	.help()
	.alias('help', 'h')
	.wrap(120)
	.argv
