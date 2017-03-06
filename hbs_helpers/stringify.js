// enduro_nojs
// * ———————————————————————————————————————————————————————— * //
// *	stringify helper
// *	Not being compiled for use on client. Only enduro use.
// *	converts object into javascript readable notation
// *	Usage:
// *		<script>
// *			var context = {{{stringify this}}}
// *		</script>
// *
// * ———————————————————————————————————————————————————————— * //

var helper = function () {}

helper.prototype.register = function () {

	enduro.templating_engine.registerHelper('stringify', function (context) {
		return JSON.stringify(context)
	})
}

module.exports = new helper()
