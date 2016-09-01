// * ———————————————————————————————————————————————————————— * //
// * 	pregenerator
// *	pregenerates helper content
// * ———————————————————————————————————————————————————————— * //
var pregenerator = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var babel = require(global.ENDURO_FOLDER + '/libs/babel/babel')

// Goes through the pages and renders them
pregenerator.prototype.pregenerate = function () {

	var promise_pregenerators = []
	for (p in pregenerators) {
		promise_pregenerators.push(pregenerators[p]())
	}

	return Promise.all(promise_pregenerators)
}

var pregenerators = []

pregenerators['settings'] = function () {
	return new Promise(function (resolve, reject) {

		var settings_template_path = path.join(ENDURO_FOLDER, 'support_files', 'admin_settings_css.hbs')
		var css_settings_destination_file_path = path.join(CMD_FOLDER, '_src', '_prebuilt', '_settings.css')

		// just resolve if settings are not present
		if (!__data.global.settings) {
			return resolve()
		}

		// load the css template
		fs.readFile(settings_template_path, 'utf8', function read (err, raw_template) {
			if (err) {
				kiska_logger.err_block(err)
			}

			var template = __templating_engine.compile(raw_template)

			var rendered_css_file = template(__data.global.settings)

			enduro_helpers.ensure_directory_existence(css_settings_destination_file_path)
				.then(() => {
					fs.writeFile(css_settings_destination_file_path, rendered_css_file, () => {
						resolve()
					})
				})
		})

	})
}

pregenerators['cultures'] = function () {

	return new Promise(function (resolve, reject) {
		var cultures_json_destionation_path = path.join(CMD_FOLDER, '_src', '_prebuilt', '_cultures.json')
		var cultures = {}
		babel.get_cultures()
			.then((fetched_cultures) => {
				cultures = fetched_cultures
				return enduro_helpers.ensure_directory_existence(cultures_json_destionation_path)
			})
			.then(() => {
				fs.writeFile(cultures_json_destionation_path, JSON.stringify(cultures), function (err) {
					if (err) {
						kiska_logger.err(err)
					}
					resolve()
				})
			})

	})
}

module.exports = new pregenerator()
