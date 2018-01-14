// * ———————————————————————————————————————————————————————— * //
// * 	event hooks
// *	execute commandline commands after certain events
// *	triggered by enduro
// *
// *	possible events:
// *		post_update - fires upon any update to the build folder
// * —————————————————————————————————————————s——————————————— * //
const event_hooks = function () {}

// * vendor dependencies
const spawn = require('child_process').exec
const Promise = require('bluebird')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')

event_hooks.prototype.execute_hook = function (hook_name) {

	if (!enduro.config.events || !(hook_name in enduro.config.events)) {
		return new Promise.resolve()
	}

	return new Promise(function (resolve, reject) {
		spawn(enduro.config.events[hook_name], [], function (err, stdout, stderr) {
			if (err) { logger.err(err) } // handled error

			process.stdout.write(stdout) // pipes output from child event
			resolve()
		})
	})
}

module.exports = new event_hooks()
