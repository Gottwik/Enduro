// * ———————————————————————————————————————————————————————— * //
// *    If compare helper
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("if_compare", function (variable1, variable2, block) {
	return block.fn(this)
})