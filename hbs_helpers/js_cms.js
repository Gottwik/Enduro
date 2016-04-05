// enduro_nojs
// This partial makes cms data accesible to client

__templating_engine.registerHelper('js_cms', function(cmsfile) {
	var glob = require("glob");
	var flatFileHandler = require('../libs/flat_utilities/flat_file_handler');

	files = glob.sync(cmd_folder + '/cms/**/' + cmsfile + '.js')

	if(files.length > 0){
		var fileInCms = files[0].match(/cms\/(.*)\.([^\\/]+)$/)[1]
		data = flatFileHandler.loadsync(fileInCms)
		return 'var global = ' + data;
	}
	return '';
});
