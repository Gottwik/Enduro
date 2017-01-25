#!/usr/bin/env node

// Stores all arguments without node and without enduro
var all_args = process.argv.slice(2)

// stores arguments
var args = []

// stores flags
var flags = []

// helper variables
// var arg
// var base

// removes enduro path and keeps the arguments
// do arg = args.shift();
// while ( fs.realpathSync(arg) !== __filename
// 	&& !(base = path.basename(arg)).match(/^enduro$|^enduro.js$|^enduro$/)
// )

for (i in all_args) {

	// check if argument is a flag or not
	all_args[i][0] != '-'
		? args.push(all_args[i])
		: flags.push(all_args[i].slice(1))
}

// runs index.js file with defined arguments
require('./index').run(args, flags)
