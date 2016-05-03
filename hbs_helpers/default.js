// * ———————————————————————————————————————————————————————— * //
// *    Default helper
// *	Let's you specify the default value in case the primary value is null
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper("default", function (name, defaultValue) {
	if(typeof name !== 'undefined'){
		return name
	}
	return defaultValue
});