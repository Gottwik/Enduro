__templating_engine.registerHelper('first', function(array, options) {
	return options.fn(array[Object.keys(array)[0]]);
});