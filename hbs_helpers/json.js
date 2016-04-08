// enduro_nojs

__templating_engine.registerHelper('json', function(context, options) {
	var fs = require('fs')
	var contents = JSON.parse(fs.readFileSync(CMD_FOLDER + context, 'utf8'));

	var accum = '';

	for (var index in contents) {
		accum += options.fn(contents[index])
	}

	return accum;
});