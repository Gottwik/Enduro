__templating_engine.registerHelper('json', function(context, options) {
	var fs = require('fs')
	var contents = JSON.parse(fs.readFileSync(process.cwd() + context, 'utf8'));

	var accum = '';

	for (var index in contents) {
		accum += options.fn(contents[index])
	}

	return accum;
});