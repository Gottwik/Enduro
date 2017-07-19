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
var logger = require(enduro.enduro_path + '/libs/logger')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var babel = require(global.enduro.enduro_path + '/libs/babel/babel')

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

		var settings_template_path = path.join(enduro.enduro_path, 'support_files', 'admin_settings_css.hbs')
		var css_settings_destination_file_path = path.join(enduro.project_path, enduro.config.build_folder, '_prebuilt', '_settings.css')

		// just resolve if settings are not present
		if (!enduro.cms_data.global.settings) {
			return resolve()
		}

		// load the css template
		fs.readFile(settings_template_path, 'utf8', function read (err, raw_template) {
			if (err) {
				logger.err_block(err)
			}

			var template = enduro.templating_engine.compile(raw_template)
			template(enduro.cms_data.global.settings)
				.then((rendered_css_file) => {
					flat_helpers.ensure_directory_existence(css_settings_destination_file_path)
						.then(() => {
							fs.writeFile(css_settings_destination_file_path, rendered_css_file, () => {
								resolve()
							})
						})
				})
		})

	})
}

pregenerators['cultures'] = function () {

	return new Promise(function (resolve, reject) {
		var cultures_json_destionation_path = path.join(enduro.project_path, enduro.config.build_folder, '_prebuilt', '_cultures.json')
		flat_helpers.ensure_directory_existence(cultures_json_destionation_path)
			.then(() => {
				fs.writeFile(cultures_json_destionation_path, JSON.stringify(enduro.config.cultures), function (err) {
					if (err) {
						logger.err(err)
					}
					resolve()
				})
			})

	})
}

module.exports = new pregenerator()
