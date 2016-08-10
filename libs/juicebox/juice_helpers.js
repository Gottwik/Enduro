// * ———————————————————————————————————————————————————————— * //
// * 	juice helpers
// *	TODO: nicer logging
// * ———————————————————————————————————————————————————————— * //
var juice_helpers = function () {}

// vendor dependencies
var dircompare = require('dir-compare')
var path = require('path')
var fs = require('fs')
var ncp = require('ncp').ncp // Handles copying files

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var juice_diff = require(ENDURO_FOLDER + '/libs/juicebox/juice_diff')

juice_helpers.prototype.diff_with_cms = function(folder) {
	return new Promise(function(resolve, reject){
		// local path
		var path1 = path.join(CMD_FOLDER, 'cms')

		// juice path
		var path2 = path.join(CMD_FOLDER, folder)

		juice_diff.diff(path1, path2)
	})
}

juice_helpers.prototype.spill_newer = function(folder) {
	return new Promise(function(resolve, reject){

		if(!enduro_helpers.dirExists(folder)) {
			return resolve()
		}

		diff = get_diff(folder)

		copy_stack = []

		diff.diffSet.forEach(function (entry) {

			if(entry.type1 != 'directory') {
				// remote is newer
				if(entry.date2 > entry.date1) {
					kiska_logger.twolog('newer in juicebar', entry.name2)
					copy_stack.push(copy_file_to_cms(entry))
				}

				// only on remote
				if(entry.state == 'right') {
					kiska_logger.twolog('new file in juicebar', entry.name2)
					copy_stack.push(copy_file_to_cms(entry))
				}
			}
		})

		Promise.all(copy_stack)
			.then(() => {
				resolve()
			})
	})
}

function get_diff(folder) {
	var path1 = path.join(CMD_FOLDER, 'cms');
	var path2 = path.join(CMD_FOLDER, folder, 'cms');
	return dircompare.compareSync(path1, path2, {compareSize: true});
}

function copy_file_to_cms(entry) {
	return new Promise(function(resolve, reject){

		var from_path = path.join(entry.path2, entry.name2)
		var to_path = path.join(CMD_FOLDER, 'cms', path.join(entry.path2, entry.name2).match(/\/cms\/(.*)/)[1])

		kiska_logger.log('copying files from ' + from_path + ' to ' + to_path, 'juicebox')

		ncp(from_path, to_path, () => {
			resolve()
		})
	})
}

module.exports = new juice_helpers()