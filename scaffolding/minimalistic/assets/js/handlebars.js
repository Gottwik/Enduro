define([
	'handlebars_core'
], function (enduro.templating_engine) {

	require(['assets/hbs_helpers/hbs_helpers.js'], function (hbs_helpers_loader) {
		hbs_helpers_loader(enduro.templating_engine)
	})

	return enduro.templating_engine
})
