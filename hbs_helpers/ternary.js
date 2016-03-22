__templating_engine.registerHelper("ternary", function (condition, value_if_true, value_if_false) {
	return condition ? value_if_true : value_if_false
});