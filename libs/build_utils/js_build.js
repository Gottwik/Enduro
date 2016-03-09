// * ———————————————————————————————————————————————————————— * //
// * 	JS build
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //

var js_build = function () {};

var rjs = require('requirejs')
var enduro_helpers = require('../flat_utilities/enduro_helpers')

// Creates all subdirectories neccessary to create the file in filepath
js_build.prototype.build_js = function(config_name) {

	!config_name
		? config_name = ''
		: config_name = '_' + config_name

	if(!enduro_helpers.fileExists(cmd_folder + '/assets/js/main' + config_name + '.js')){
		console.log('No config file named main' + config_name + '.js');
		return
	}


	return new Promise(function(resolve, reject){
		config = {
			mainConfigFile: cmd_folder + '/assets/js/main' + config_name + '.js',
			baseUrl: cmd_folder + '/assets/',
			name: 'js/main',
			out: cmd_folder + '/_src/assets/js/main_dist.js',
			include: ["vendor/requirejs/require"],
		};

		rjs.optimize(config, function(buildResponse){
			console.log(buildResponse)
			cb()
		}, function(err){
			console.log(err)
		});
	})
}

module.exports = new js_build()