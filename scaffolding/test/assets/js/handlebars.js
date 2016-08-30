define([
	'handlebars_core'
], function (__templating_engine) {

	require(['assets/hbs_helpers/hbs_helpers.js'], function (hbs_helpers_loader) {
		hbs_helpers_loader(__templating_engine)
	})

	return __templating_engine
})
