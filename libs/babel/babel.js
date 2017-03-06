// * ———————————————————————————————————————————————————————— * //
// * 	babel
// *	handles multilingual support
// * ———————————————————————————————————————————————————————— * //
var babel_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var require_from_string = require('require-from-string')

// local dependencies
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var flat = require(enduro.enduro_path + '/libs/flat_db/flat')

// gets list of all cultures
babel_handler.prototype.get_cultures = function () {
	return new Promise(function (resolve, reject) {
		var babel_absolute_path = flat.get_full_path_to_flat_object(enduro.config.babel_file)
		// check if file exists. return empty object if not
		if (!flat_helpers.file_exists_sync(babel_absolute_path)) {
			return resolve([''])
		}
		fs.readFile(babel_absolute_path, function (err, data) {
			if (err) { return reject() }

			// check if file is empty. return empty object if so
			if (data == '') {
				return resolve([''])
			}
			var cultures_datafile = require_from_string('module.exports = ' + data)

			// set first culture as starting path
			enduro.development_firstload_url = cultures_datafile.cultures[0] + '/'

			cultures_datafile.cultures.push('')

			return resolve(cultures_datafile.cultures)
		})
	})
}

// adds culture to culture array in cms folder
babel_handler.prototype.add_culture = function (cultures) {
	return flat.update(enduro.config.babel_file, { cultures: cultures })
}

function culturize (context, culture) {
	if (typeof (context) != 'object') {
		return context
	}

	terminated_context = terminate(context)

	var culturized_part = {}
	for (var key in terminated_context) {

		var cultural_key = get_cultural_key(key, culture)

		if (cultural_key in context) {
			culturized_part[key] = culturize(context[cultural_key], culture)
		} else {
			culturized_part[key] = culturize(context[key], culture)
		}
	}
	return culturized_part
}

function terminate (context) {
	var terminated_context = {}

	for (var key in context) {
		if (key[0] != '$') {
			terminated_context[key] = context[key]
		}
	}

	return terminated_context
}

function get_cultural_key (key, culture) {
	return '$' + key + '_' + culture
}

// Culturalize context
babel_handler.prototype.culturalize = function (context, culture) {
	return culturize(context, culture)
}

module.exports = new babel_handler()
