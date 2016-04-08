
// * ———————————————————————————————————————————————————————— * //
// * 	Enduro Helpers
// *	Random set of helper functions used all around
// * ———————————————————————————————————————————————————————— * //

var babel_splitter = function () {};

var fs = require('fs')
var Promise = require('bluebird')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var require_from_string = require('require-from-string')

// Gets list of all cultures
babel_splitter.prototype.getcultures = function (filePath) {
	return new Promise(function(resolve, reject){
		// check if file exists. return empty object if not
		if(!enduro_helpers.fileExists(BABEL_FILE)){
			resolve([''])
		}
		fs.readFile( BABEL_FILE , function(err, data) {
			if (err) { reject() }

			// check if file is empty. return empty object if so
			if(data == ''){
				return resolve([''])
			}
			var cultures = require_from_string('module.exports = ' + data)

			resolve(cultures)
		})
	})
}

function culturize(context, culture){

	if(typeof(context) != 'object'){
		return context
	}

	var culturized_part = {}
	for(var key in context){
		if(key.match(/^\$.*/)){
			return context['$' + culture]
		}
		culturized_part[key] = culturize(context[key], culture)
	}
	return culturized_part
}

// Culturalize context
babel_splitter.prototype.culturalize = function (context, culture) {
	return culturize(context, culture)
}

module.exports = new babel_splitter()