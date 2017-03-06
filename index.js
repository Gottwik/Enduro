// * ———————————————————————————————————————————————————————— * //
// *	enduro.js
// *	Minimalistic, lean & mean, node.js cms
// * ———————————————————————————————————————————————————————— * //

// vendor dependencies
var path = require('path')
var Promise = require('bluebird')

var linker = require('./libs/linker/linker')

var enduro_instance = function () {}

enduro_instance.prototype.init = function () {
	// exposes enduro api, state, variables and configuration as public variable
	// to cut down on complexity when developing enduro projects
	global.enduro = linker.init_enduro_linked_configuration(process.cwd(), __dirname)

	// exposes enduro's api libraries and action functions
	linker.expose_enduro_api()
	linker.expose_enduro_actions()

	return linker.read_config()
}

// // local dependencies
// var scaffolder = require(enduro.enduro_path + '/libs/scaffolder')
// var logger = require(enduro.enduro_path + '/libs/logger')
// var trollhunter = require(enduro.enduro_path + '/libs/trollhunter')
// var js_build = require(enduro.enduro_path + '/libs/build_utils/js_build')
// var admin_security = require(enduro.enduro_path + '/libs/admin_utilities/admin_security')
// var gulp = require(enduro.enduro_path + '/gulpfile')
// var babel = require(enduro.enduro_path + '/libs/babel/babel')
// var flag_handler = require(enduro.enduro_path + '/libs/cli_tools/flag_handler')
// var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
// var enduro_server = require(enduro.enduro_path + '/server')
// var log_clusters = require(enduro.enduro_path + '/libs/log_clusters/log_clusters')
// var global_data = require(enduro.enduro_path + '/libs/global_data')

// // * ———————————————————————————————————————————————————————— * //
// // * 	run
// // *	entry point from the cli
// // *	returns boolean based on if the arguments were recognized
// // * ———————————————————————————————————————————————————————— * //
// function run (args, flags) {
// 	enduro.flags = flag_handler.get_flag_object(flags)
// 	// * ———————————————————————————————————————————————————————— * //
// 	// * 	$ enduro
// 	// * ———————————————————————————————————————————————————————— * //
// 	if (args.length == 0) {
// 		return enduro.actions.developer_start()
// 	}

// 	// parse arguments
// 	while (arg = args.shift()) {

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro render
// 		// * ———————————————————————————————————————————————————————— * //
// 		if (arg == 'render' || arg == 'r') {
// 			return enduro.actions.render(() => {}, false)

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro start
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'start') {
// 			return enduro_server.run(args)

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro create projectname
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'create') {
// 			return scaffolder.scaffold(args)

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro secure passphrasehere
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'secure') {
// 			return trollhunter.set_passphrase(args)

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro build [dev]
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'build') {
// 			return js_build.build_js(args.shift())

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro addadmin (username) (password)
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'addadmin') {
// 			return admin_security.add_admin(args.shift(), args.shift(), args.shift())

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro addculture (culture1) [culture2] ...
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'addculture') {
// 			return babel.add_culture(args)

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro juice ...
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'juice') {
// 			arg = args.shift()

// 			// * ———————————————————————————————————————————————————————— * //
// 			// * 	$ enduro juice pack
// 			// * ———————————————————————————————————————————————————————— * //
// 			if (arg == 'pack') {
// 				if (enduro.flags.force) {
// 					return juicebox.force_pack()
// 				} else {
// 					return juicebox.pack()
// 				}

// 			// * ———————————————————————————————————————————————————————— * //
// 			// * 	$ enduro juice pull
// 			// * ———————————————————————————————————————————————————————— * //
// 			} else if (arg == 'pull') {
// 				return juicebox.pull()

// 			// * ———————————————————————————————————————————————————————— * //
// 			// * 	$ enduro juice diff
// 			// * ———————————————————————————————————————————————————————— * //
// 			} else if (arg == 'diff') {
// 				return juicebox.diff(args)

// 			// * ———————————————————————————————————————————————————————— * //
// 			// * 	$ enduro juice log
// 			// * ———————————————————————————————————————————————————————— * //
// 			} else if (arg == 'log') {
// 				return juicebox.log()
// 			}

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro flags
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'flags') {
// 			return flag_handler.list_flags()

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro offline
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'offline') {
// 			return require(enduro.enduro_path + '/libs/remote_tools/offline_handler').convert_all_to_offline()

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro upload
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'upload') {
// 			return require(enduro.enduro_path + '/libs/cli_tools/cli_upload').cli_upload(args.shift())

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro theme
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'theme') {
// 			return require(enduro.enduro_path + '/libs/theme_manager/theme_manager').create_from_theme(args.shift())

// 		// * ———————————————————————————————————————————————————————— * //
// 		// * 	$ enduro theme
// 		// * ———————————————————————————————————————————————————————— * //
// 		} else if (arg == 'test') {
// 			logger.loading('creating something')
// 			setTimeout(() => {
// 				logger.loaded('creating something')
// 			}, 3000)
// 		}
// 	}

// 	// some weird arguments
// 	logger.log('Arguments not recognized')
// 	return new Promise(function (resolve, reject) { reject('not recognized') })

// }

module.exports = new enduro_instance()
