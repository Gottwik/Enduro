// * ———————————————————————————————————————————————————————— * //
// *    slug helper
// *	Usage:
// *
// *	{{slug 'This Link'}}
// *
// *	will return this-link
// * ———————————————————————————————————————————————————————— * //

const helper = function () {}

helper.prototype.register = function () {

	const format_service = require(enduro.enduro_path + '/libs/services/format_service')

	enduro.templating_engine.registerHelper('slug', function (text) {

		if (!text) {
			return ''
		}

		return format_service.slug(text)
	})
}

module.exports = new helper()
