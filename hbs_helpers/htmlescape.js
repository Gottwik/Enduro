// * ———————————————————————————————————————————————————————— * //
// *    htmlescape helper
// *	Usage:
// *
// *	{{htmlescape 'www.example.com?p=escape spaces here'}}
// *
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper("uriencode", function (url) {
	return encodeURI(url);
});