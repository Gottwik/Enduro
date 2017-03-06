// * ———————————————————————————————————————————————————————— * //
// *    Default helper
// *	Let's you specify the default value in case the primary value is null
// *	Usage:
// *
// *	{{Default age 20}} <<< if no age is provided 20 will be used
// *
// * ———————————————————————————————————————————————————————— * //

var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('default', function (name, defaultValue, options) {

		if (typeof options === 'undefined') {
			defaultValue = ''
		}

		return typeof name !== 'undefined'
			? name
			: defaultValue
	})

}

module.exports = new helper()
