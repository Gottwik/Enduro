// * ———————————————————————————————————————————————————————— * //
// * 	brick handler
// *	bricks are plugins for enduro
// *	this module handles their loading and plugging into enduro
// * ———————————————————————————————————————————————————————— * //
const brick_handler = function () {}

const path = require('path')

// * ———————————————————————————————————————————————————————— * //
// * 	loads, initialize and pre-store brick-related data
// * ———————————————————————————————————————————————————————— * //
brick_handler.prototype.load_bricks = function () {
	const self = this
	const all_bricks = enduro.config.bricks

	enduro.config.brick_admin_injects = []
	for (brick_name in all_bricks) {
		const brick_instance = self._require_brick(brick_name)
		
		if (brick_instance.init) {
			brick_instance.init()
		}

		if (brick_instance.brick_configuration.admin_js_inject) {
			enduro.config.brick_admin_injects.push('/brick/' + brick_name + '/' + brick_instance.brick_configuration.admin_js_inject)
		}
	}
}

// * ———————————————————————————————————————————————————————— * //
// * 	server brick static assets
// * 	every brick comes with static files which enduro will server under
// * 	/bricks/:brick_name/...
// * ———————————————————————————————————————————————————————— * //
brick_handler.prototype.serve_brick_static_assets = function (app, express) {
	const self = this

	for (brick_name in enduro.config.bricks) {
		const bricks_asset_folder = path.join(self._get_bricks_root_folder(brick_name), 'assets')
		app.use('/brick/' + brick_name, express.static(bricks_asset_folder))
	}
}

// * ———————————————————————————————————————————————————————— * //
// * 	require brick by brick name
// * ———————————————————————————————————————————————————————— * //
brick_handler.prototype._require_brick = function (brick_name) {
	const self = this

	// not sure if this is the best way to handle this
	return require(self._get_bricks_root_folder(brick_name))
}

// * ———————————————————————————————————————————————————————— * //
// * 	get absolute path to brick's root folder
// * ———————————————————————————————————————————————————————— * //
brick_handler.prototype._get_bricks_root_folder = function (brick_name) {
	return path.join(enduro.project_path, 'node_modules', brick_name)
}

module.exports = new brick_handler()
