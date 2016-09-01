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

__templating_engine.registerHelper('json', function (filename, options) {
	var fs = require('fs')
	var contents = JSON.parse(fs.readFileSync(CMD_FOLDER + filename, 'utf8'))

	return options.fn(contents)
})
