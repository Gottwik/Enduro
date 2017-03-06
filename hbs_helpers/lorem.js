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

var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('lorem', function (length, upperrange) {

		// set length to 10 if no length is provided
		if (typeof length !== 'number') {
			length = 10
		}

		// set upperrange to length if no upperrange is provided
		upperrange = typeof upperrange === 'number'
			? upperrange
			: length

		// generate random length
		length = Math.round(Math.random() * (upperrange - length) + length)

		// Calvin and Hobbes is the best!
		var dummy = 'Calvin and Hobbes is a daily comic strip by American cartoonist Bill Watterson that was syndicated from November 18 1985 to December 31 1995 Commonly cited as the last great newspaper comic Calvin and Hobbes has evinced broad and enduring popularity influence and academic interest Calvin and Hobbes follows the humorous antics of Calvin a precocious mischievous and adventurous six-year-old boy and Hobbes his sardonic stuffed tiger The pair is named after John Calvin 16th-century French Reformation theologian and Thomas Hobbes a 17th-century English political philosopher Set in the contemporary suburban United States the strip depicts Calvin\'s frequent flights of fancy and his friendship with Hobbes It also examines Calvin\'s relationships with family and classmates especially the love hate relationship between him and his classmate Susie Derkins Hobbes dual nature is a defining motif for the strip to Calvin Hobbes is a live anthropomorphic tiger all the other characters see Hobbes as an inanimate stuffed toy Though the series does not mention specific political figures or current events it does explore broad issues like environmentalism public education philosophical quandaries and the flaws of opinion polls At the height of its popularity Calvin and Hobbes was featured in over 2,400 newspapers worldwide In 2010 reruns of the strip appeared in more than 50 countries and nearly 45 million copies of the Calvin and Hobbes books had been sold'

		// Randomize string
		dummy = dummy
			.split(' ')
			.sort(function () {
				return .5 - Math.random()
			})
			.slice(0, length)
			.join(' ')

		// make first letter capital and add period at the end
		dummy = dummy[0].toUpperCase() + dummy.substring(1) + '.'

		return dummy
	})
}

module.exports = new helper()
