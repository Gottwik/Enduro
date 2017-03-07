// * ———————————————————————————————————————————————————————— * //
// * 	enduro_default_configuration
// *	provides default settings and variables, which can be overriden
// *	by enduro.json and enduro_secret.json files
// * ———————————————————————————————————————————————————————— * //

// vendor dependencies
var path = require('path')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')

// main config object
var default_configuration = {
    default_configuration: {
		project_name: 'Enduro project',
		project_slug: 'en',
		render_templates: true,
		juicebox_enabled: false,
		admin_folder: path.join(enduro.project_path, 'node_modules', 'enduro_admin', '_src'),
		admin_secure_file: '.users',
		babel_file: 'config/babel',
		filesystem: 'local'
	},
	default_secret_configuration: {}
}

// admin_folder
// checks if admin folder exists in local node_modules and change it to enduro's if it doesn't
// this is useful if enduro is installed globally, otherwise npm install would be needed to get the admin
if (!flat_helpers.dir_exists_sync(default_configuration.default_configuration.admin_folder)) {
	default_configuration.default_configuration.admin_folder = path.join(enduro.enduro_path, 'node_modules', 'enduro_admin', '_src')
}

module.exports = default_configuration