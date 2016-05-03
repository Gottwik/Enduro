// enduro_nojs
// * ———————————————————————————————————————————————————————— * //
// *	Js_cms helper
// *	Not being compiled for use on client. Only enduro use.
// *	Converts part of cms context into stirng with js object/array notation
// *	Usable when passing cms static data to client.
// *	Usage:
// *
// *	<script>
// *		var global = {{{js_cms 'people'}}}
// *		// global.mike.age is now
// *	</script>
// *
// * ———————————————————————————————————————————————————————— * //

__templating_engine.registerHelper('js_cms', function(cmsfile) {
	var glob = require("glob")
	var flat_file_handler = require('../libs/flat_utilities/flat_file_handler')

	files = glob.sync(CMD_FOLDER + '/cms/**/' + cmsfile + '.js')

	if(files.length > 0){
		var file_in_cms = files[0].match(/cms\/(.*)\.([^\\/]+)$/)[1]
		return flat_file_handler.loadsync(file_in_cms)
	}
	return ''
});
