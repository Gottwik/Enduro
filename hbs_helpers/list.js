__templating_engine.registerHelper('list', function() {

	// block is the last argument
	var block = arguments[arguments.length - 1]

	var accum = '';
	for (var i = 0; i < arguments.length - 1; i++)
		accum += block.fn(arguments[i]);
	return accum;
});