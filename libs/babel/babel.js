// * ———————————————————————————————————————————————————————— * //
// * 	babel
// *	handles multilingual support
// * ———————————————————————————————————————————————————————— * //
var babel = function () {}

// vendor dependencies
var _ = require('lodash')

// local dependencies
var enduro_configurator = require(enduro.enduro_path + '/libs/configuration/enduro_configurator')

// adds culture to culture array in cms folder
babel.prototype.add_culture = function (cultures) {
	enduro.config.cultures = enduro.config.cultures.concat(cultures)

	// by default there exists an empty culture that generates files as if there was no culture
	// we get rid of this culture once some cultures are added
	var cultures_to_save = _.pull(enduro.config.cultures, '')

	enduro_configurator.set_config({ cultures: cultures_to_save })
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
babel.prototype.culturalize = function (context, culture) {
	return culturize(context, culture)
}

module.exports = new babel()
