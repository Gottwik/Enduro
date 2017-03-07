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
var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('times', function (iterations, upperrange, block) {

		// will store the final accumulated html
		var accum = ''

		// if upperrange is not provided
		if (typeof upperrange !== 'number') {
			block = upperrange
		} else {
			// if upperrange is provided, picks randomly from range
			iterations = Math.round(Math.random() * (upperrange - iterations) + iterations)
		}

		for (var i = 0; i < iterations; ++i) {

			// Sets is_first variable to context
			i == 0
				? this.is_first = true
				: this.is_first = false

			// Sets index to context
			this.times_index = i

			// Renders block context and adds it to the accumulated context
			accum += block.fn(this)
		}

		// return accumulated html
		return accum
	})
}

module.exports = new helper()
