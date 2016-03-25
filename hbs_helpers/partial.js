__templating_engine.registerHelper("partial", function (name, options) {

	// Get the partial with the given name. This is a string.
	var partial = __templating_engine.partials[name]
	// Return empty string if the partial is not defined
	if (!partial) return ""

	// build up context
	context = this
	context.global = options.data.root.global

	// Compile and call the partial with context
	return (typeof partial == 'function')
		? new __templating_engine.SafeString(partial(context))
		: new __templating_engine.SafeString(__templating_engine.compile(partial)(context))

});