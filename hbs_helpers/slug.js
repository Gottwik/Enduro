// * ———————————————————————————————————————————————————————— * //
// *    slug helper
// *	Usage:
// *
// *	{{slug 'This Link'}}
// *
// *	will return this-link
// * ———————————————————————————————————————————————————————— * //

var format_service = require(ENDURO_FOLDER + '/libs/services/format_service')

enduro.templating_engine.registerHelper('slug', function (text) {

	if (!text) {
		return ''
	}

	return format_service.slug(text)
})
