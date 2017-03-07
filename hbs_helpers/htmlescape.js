// * ———————————————————————————————————————————————————————— * //
// *    htmlescape helper
// *	Usage:
// *		{{htmlescape 'www.example.com?p=escape spaces here'}}
// *
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('uriencode', function (url) {
		return encodeURI(url)
	})
}

module.exports = new helper()
