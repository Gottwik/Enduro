// * ———————————————————————————————————————————————————————— * //
// *    Grouped each helper
// *    Will split array into chunks of specified size
// *    taken from https://funkjedi.com/technology/412-every-nth-item-in-handlebars/
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper('grouped_each', function(every, context, options) {
	var out = ""
	var subcontext = []
	var i = 0

	if(context && (Object.keys(context).length || context.length)) {
		if(typeof context === 'object'){ // Context is an object
			for (var key in context) {
				if (i > 0 && i % every === 0) {
					out += options.fn(subcontext)
					subcontext = []
				}
				subcontext.push(context[key])
				i++
			}
			out += options.fn(subcontext)
		} else { // Context is array
			for (i = 0; i < context.length; i++) {
				if (i > 0 && i % every === 0) {
					out += options.fn(subcontext)
					subcontext = []
				}
				subcontext.push(context[i])
			}
			out += options.fn(subcontext)
		}
	}

	// Outputs processed html
	return out
})