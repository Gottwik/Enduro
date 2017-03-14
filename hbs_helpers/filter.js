// * ———————————————————————————————————————————————————————— * //
// *    filter helper
// *	filters context by applying lodash's isMatch
// *	usage:
// *
// *	{{#filter '{"depth": 0}'}}
// *		<p>Image: {{this}}</p>
// *	{{/filter}}
// * ———————————————————————————————————————————————————————— * //
var helper = function () {}

// vendor dependency
var _ = require('lodash')

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('filter', function (filter_string, handlebars_context) {

		// parses filter_string into object and if current context passes isMatch renders the template
		if (_.isMatch(this, JSON.parse(filter_string))) {
			return handlebars_context.fn(this)
		}

	})
}

module.exports = new helper()
