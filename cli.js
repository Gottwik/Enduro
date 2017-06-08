#!/usr/bin/env node

// this is the entry point for cli commands
// each command is a corresponding file in the /cli_commands folder strucutre
global.program = require('yargs')
	.commandDir('cli_commands') // sets /cli_commands as source for the commands
	.version(require('./package.json').version) // fetches the current version from package.json
	.help().alias('help', 'h') // creates help command with a -h alias
	.wrap(120) // wraps lines at 120 characters
	.argv
