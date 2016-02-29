__templating_engine.registerHelper('json', function(context, options) {
	var fs = require('fs')
	var contents = JSON.parse(fs.readFileSync(cmd_folder + context, 'utf8'));

	var accum = '';

	for (var index in contents) {
		accum += options.fn(contents[index])
	}

	return accum;
});