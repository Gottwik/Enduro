__templating_engine.registerHelper("compare", function (variable1, variable2, value_if_true, value_if_false) {
	return variable1 == variable2 ? value_if_true : value_if_false
});