// * ———————————————————————————————————————————————————————— * //
// * 	babel
// *	handles multilingual support
// * ———————————————————————————————————————————————————————— * //
const babel = function () {}

// * vendor dependencies
const _ = require('lodash')

// * enduro dependencies
const enduro_configurator = require(enduro.enduro_path + '/libs/configuration/enduro_configurator')

// adds culture to culture array in cms folder
babel.prototype.add_culture = function (cultures) {
	enduro.config.cultures = enduro.config.cultures.concat(cultures)

	// by default there exists an empty culture that generates files as if there was no culture
	// we get rid of this culture once some cultures are added
	const cultures_to_save = _.pull(enduro.config.cultures, '')

	enduro_configurator.set_config({ cultures: cultures_to_save })
}

function culturize (context, culture) {
	if (typeof (context) != 'object') {
		return context
	}

	// don't botch arrays into objects
	if (Array.isArray(context)) {
		for (let i = 0, l = context.length; i < l; i++) {
			context[i] = culturize(context[i], culture)
		}
		return context
	}

	terminated_context = terminate(context)

	let culturized_part = {}
	for (let key in terminated_context) {

		const cultural_key = get_cultural_key(key, culture)

		if (cultural_key in context) {
			culturized_part[key] = culturize(context[cultural_key], culture)
		} else {
			culturized_part[key] = culturize(context[key], culture)
		}
	}
	return culturized_part
}

function terminate (context) {
	let terminated_context = {}

	for (let key in context) {
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
