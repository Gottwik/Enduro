define([],function(){ return function(__templating_engine){ 

// * ———————————————————————————————————————————————————————— * //
// *    Add helper
// *	Adds two numbers together
// *	Usage:
// *
// *	{{add @index 2}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("add", function (variable, addvalue) {
	return variable + addvalue
});
// * ———————————————————————————————————————————————————————— * //
// *    Compare helper
// *	Simple ternary-style helper that will choose between two ouputs based on if the variables provided are equal
// *	Usage:
// *
// *	{{Compare age 20 'this dude is exactly 20 years old' 'he's not 20 years old}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("compare", function (variable1, variable2, value_if_true, value_if_false) {
	return variable1 == variable2
		? value_if_true
		: value_if_false
})
// * ———————————————————————————————————————————————————————— * //
// *    Default helper
// *	Let's you specify the default value in case the primary value is null
// *	Usage:
// *
// *	{{Default age 20}} <<< if no age is provided 20 will be used
// *
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper("default", function (name, defaultValue) {
	return typeof name !== 'undefined'
		? name
		: defaultValue
});
// * ———————————————————————————————————————————————————————— * //
// *    Files helper
// *	Find all files in path and provide them as each
// *	Usage:
// *
// *	{{#files '/assets/images/'}}
// *		<p>Image: {{this}}</p>
// *	{{/files}}
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('files', function(path, block) {
	var glob = require('glob')

	var files = glob.sync(CMD_FOLDER + path + '/**/*.*')

	var output = files.map((file) => {
		return file.replace(new RegExp('.*' + path), '')
	}).reduce((prev, next) => {
		return prev + block.fn(next)
	}, '')

	return output
})
// * ———————————————————————————————————————————————————————— * //
// *    First helper
// *	Gets the first element of an array or object
// *	Usage:
// *
// *	{{#first people}}
// *		<p>First person's age is: {{age}}</p>
// *	{{/first}}
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('first', function(array, options) {
	return options.fn(array[Object.keys(array)[0]])
})
// * ———————————————————————————————————————————————————————— * //
// *    Grouped each helper
// *    Will split array into chunks of specified size
// *    taken from https://funkjedi.com/technology/412-every-nth-item-in-handlebars/
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper('grouped_each', function(every, context, options) {

	if(!context || !(Object.keys(context).length || context.length)) {
		return ''
	}

	var out = ''
	var subcontext = []
	var i = 0

	if(typeof context === 'object') { // Context is an object
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


	// Outputs processed html
	return out
})
// * ———————————————————————————————————————————————————————— * //
// *    Uriencode helper
// *	Usage:
// *
// *	{{htmlescape 'www.example.com?p=escape spaces here'}}
// *
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper("uriencode", function (url) {
	return encodeURI(url);
});
// * ———————————————————————————————————————————————————————— * //
// *    If compare helper
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("if_compare", function (variable1, variable2, block) {
	return block.fn(this)
})
// * ———————————————————————————————————————————————————————— * //
// *    List helper
// *	Provides #each functionality with a inline list
// *	Usage:
// *
// *	{{#list 'small' 'medium' 'large'}}
// *		<p class="{{this}}">test text</p>
// *	{{/list}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('list', function() {

	// block is the last argument
	var block = arguments[arguments.length - 1]

	var accum = ''
	for (var i = 0; i < arguments.length - 1; i++) {
		accum += block.fn(arguments[i])
	}
	return accum
});
// * ———————————————————————————————————————————————————————— * //
// *    Lorem helper
// *	Generates dummy text with a specified length in words
// *	Usage:
// *
// *	{{lorem 20}}
// *
// *	If two arguments are provided random number of words from this range will be generated
// *
// *	{{lorem 10 20}}
// *
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper("lorem", function (length, upperrange) {

	length = length || 10

	upperrange = typeof upperrange === 'number'
		? upperrange
		: length

	length = Math.round(Math.random() * (upperrange - length) + length)

	var dummy = 'Calvin and Hobbes is a daily comic strip by American cartoonist Bill Watterson that was syndicated from November 18 1985 to December 31 1995 Commonly cited as the last great newspaper comic Calvin and Hobbes has evinced broad and enduring popularity influence and academic interest Calvin and Hobbes follows the humorous antics of Calvin a precocious mischievous and adventurous six-year-old boy and Hobbes his sardonic stuffed tiger The pair is named after John Calvin 16th-century French Reformation theologian and Thomas Hobbes a 17th-century English political philosopher Set in the contemporary suburban United States the strip depicts Calvin\'s frequent flights of fancy and his friendship with Hobbes It also examines Calvin\'s relationships with family and classmates especially the love hate relationship between him and his classmate Susie Derkins Hobbes dual nature is a defining motif for the strip to Calvin Hobbes is a live anthropomorphic tiger all the other characters see Hobbes as an inanimate stuffed toy Though the series does not mention specific political figures or current events it does explore broad issues like environmentalism public education philosophical quandaries and the flaws of opinion polls At the height of its popularity Calvin and Hobbes was featured in over 2,400 newspapers worldwide In 2010 reruns of the strip appeared in more than 50 countries and nearly 45 million copies of the Calvin and Hobbes books had been sold'

	// Randomize string
	dummy = dummy
		.split(' ')
		.sort(function() {
			return .5 - Math.random()
		})
		.slice(0, length)
		.join(' ')

	// Make first letter Capital and add period at the end
	dummy = dummy[0].toUpperCase() + dummy.substring(1) + '.'

	return dummy
});
// * ———————————————————————————————————————————————————————— * //
// *    Partial helper
// *	Loads a partial dynamically by name. This allows to define the structure of a page in a cms file.
// *	Usage:
// *
// *	{{partial 'partial name'}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("partial", function (name, options) {

	// Get the partial with the given name. This is a string.
	var partial = __templating_engine.partials[name]

	// Return empty string if the partial is not defined
	if (!partial) return ''

	// build up context
	context = this
	context.global = options.data.root.global

	// Compile and call the partial with context
	return (typeof partial == 'function')
		? new __templating_engine.SafeString(partial(context))
		: new __templating_engine.SafeString(__templating_engine.compile(partial)(context))

});
// * ———————————————————————————————————————————————————————— * //
// *    switch helper
// *	provides switch functionality with inline arguments
// *	usage:
// *
// *	{{switch small '5px' medium '10px' large '20px'}}
// *
// *	returns last value as default
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('switch', function() {

	// create a list out of arguments
	var arguments_list = []
	for(var i in arguments) {
		arguments_list.push(arguments[i])
	}

	// remove last element - which is the whole context
	arguments_list = arguments_list.slice(0, -1)

	// check even argumens and return respective odd argument
	for(var i = 0; i < Math.floor(arguments_list.length / 2); i++) {
		if(arguments_list[i * 2]) {
			return arguments_list[i * 2 + 1]
		}
	}

	// return last provided argument as a default value
	return arguments_list.slice(-1)[0]
});
// * ———————————————————————————————————————————————————————— * //
// *    Ternary helper
// *	Simple if helper with two possible outputs
// *	Usage:
// *
// *	{{ternary this 'was true' 'was false'}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("ternary", function (condition, value_if_true, value_if_false) {
	return condition
		? value_if_true
		: value_if_false
});
// * ———————————————————————————————————————————————————————— * //
// *    Times helper
// *	Duplicates specified inner block specified times
// *	Usage:
// *
// *	{{#time 10}}
// *		<p>This is repeated 10 times</p>
// *	{{/times}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('times', function(iterations, upperrange, block) {

	// will store the final accumulated html
	var accum = ''

	// if upperrange is not provided
	if(typeof upperrange !== 'number') {
		block = upperrange;
	} else {
		// if upperrange is provided, picks randomly from range
		iterations = Math.round(Math.random() * (upperrange - iterations) + iterations)
	}

	for(var i = 0; i < iterations; ++i){

		// Sets is_first variable to context
		i == 0
			? this.is_first = true
			: this.is_first = false;

		// Sets index to context
		this.times_index = i;

		// Renders block context and adds it to the accumulated context
		accum += block.fn(this)
	}

	// return accumulated html
	return accum
})
// * ———————————————————————————————————————————————————————— * //
// * 	Within helper
// *	Changes context of the block inside for array's descendant
// *	with provided key
// *	Usage:
// *
// *	{{#within people mike}}
// *		<p>Mike's age is: {{age}}</p>
// *	{{/within}}
// *
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper('within', function(array, key, options) {
	return options.fn(array[key])
})

 }})