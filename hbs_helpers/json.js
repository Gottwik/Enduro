// enduro_nojs
// * ———————————————————————————————————————————————————————— * //
// *	Json Helper
// *	Will read a specified json file
// *	Usage:
// *
// *	{{#json 'mock/jsons/people.json'}}
// *		<p class="{{age}}">test text</p> << File contents is used as context here
// *	{{/json}}
// *
// * ———————————————————————————————————————————————————————— * //

var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('json', function (filename, options) {
		var fs = require('fs')
		var contents = JSON.parse(fs.readFileSync(enduro.project_path + filename, 'utf8'))

		return options.fn(contents)
	})
}

module.exports = new helper()
