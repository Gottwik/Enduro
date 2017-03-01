// * ———————————————————————————————————————————————————————— * //
// *    htmlescape helper
// *	Usage:
// *		{{htmlescape 'www.example.com?p=escape spaces here'}}
// *
// * ———————————————————————————————————————————————————————— * //

enduro.templating_engine.registerHelper('uriencode', function (url) {
	return encodeURI(url)
})
