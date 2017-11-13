// * ———————————————————————————————————————————————————————— * //
// * 	get admin extension list
// *
// * 	admin api endpoint admin_api/get_admin_extensions
// *	@return {response} - success boolean and array of .js files to be injected to admin
// * ———————————————————————————————————————————————————————— * //
const api_call = function () {}

// * vendor dependencies
const glob = require('glob-promise')
const path = require('path')

// * enduro dependencies
const brick_handler = require(enduro.enduro_path + '/libs/bricks/brick_handler')

// * constants
const extension_path = path.join(enduro.project_path, 'assets', 'admin_extensions', '**', '*.js')

// routed call
api_call.prototype.call = function (req, res, enduro_server) {

	glob(extension_path)
		.then((extensions) => {

			// removes part of absolute path
			extensions = extensions.map((extension) => { return extension.match(/admin_extensions\/(.*)/)[1] })

			// add path prefix for default extensions
			extensions = extensions.map((extension) => { return '/assets/admin_extensions/' + extension })

			// adds admin js injects by bricks
			if (enduro.config.brick_admin_injects) {
				extensions = extensions.concat(enduro.config.brick_admin_injects)
			}

			res.send({ success: true, data: extensions })
		}, () => {})
}

module.exports = new api_call()
