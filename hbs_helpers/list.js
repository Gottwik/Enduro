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
const helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('list', function () {

		// block is the last argument
		const block = arguments[arguments.length - 1]

		let accum = ''
		for (let i = 0; i < arguments.length - 1; i++) {
			accum += block.fn(arguments[i])
		}

		// returns the built string
		return accum
	})
}

module.exports = new helper()
