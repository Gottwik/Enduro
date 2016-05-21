#!/usr/bin/env node

// * ———————————————————————————————————————————————————————— * //
// * 	enduro's production server
// *
// *	runs production server with password protection and
// *	admin ui and better routing
// *
// *	uses express mvc
// * ———————————————————————————————————————————————————————— * //

// vendor dependencies
var path = require("path")
var fs = require("fs")

// stores arguments in array
var args = process.argv.slice(1)

// helper variables
var arg
var base

// removes enduro path and keeps the arguments
do arg = args.shift();
while ( fs.realpathSync(arg) !== __filename
	&& !(base = path.basename(arg)).match(/^enduro$|^enduro.js$|^enduro$/)
)

// runs index.js file with defined arguments
require("./index").run(args)