__templating_engine.registerHelper("default", function (name, defaultValue) {
	if(typeof name !== 'undefined'){
		return name
	}
	return defaultValue
});