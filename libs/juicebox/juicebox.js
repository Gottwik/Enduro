// * ———————————————————————————————————————————————————————— * //
// * 	juicebox
// *	deals with lack of persistent storage
// *	TODO: juicefiles are public. maybe not the best idea
// * ———————————————————————————————————————————————————————— * //
var juicebox = function () {};

// vendor dependencies
var Promise = require('bluebird')
var fstream = require('fstream')
var tar = require('tar')
var zlib = require('zlib')
var path = require('path')
var fs = require('fs')

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var remote_handler = require(ENDURO_FOLDER + '/libs/remote_tools/remote_handler')

var EXTENSION = '.tar.gz'

// packs up the juicebox together with new juice.json
juicebox.prototype.pack = function () {
	return new Promise(function(resolve, reject){

		if(!config.project_name) {
			return reject('Set project name in enduro.json')
		}

		var juice = {}

		juice.latest_juicebox = 'jb_' + config.project_name + '_' + Math.floor(Date.now() / 1000) + EXTENSION
		juice.timestamp = Math.floor(Date.now() / 1000)

		write_juicebox(juice.latest_juicebox)
			.then(() => {
				return write_juicefile(juice)
			})
			.then(() => {
				return remote_handler.upload_to_s3_by_filepath('juicebox/juice.json', path.join(CMD_FOLDER, 'juicebox', 'juice.json'))
			})
			.then(() => {
				return remote_handler.upload_to_s3_by_filepath('juicebox/' + juice.latest_juicebox, path.join(CMD_FOLDER, 'juicebox', juice.latest_juicebox))
			})
			.then(() => {
				kiska_logger.init('Juiceboxing')
				kiska_logger.log('Juiceboxname: ' + juice.latest_juicebox)
				kiska_logger.end()
			})

	})
}

juicebox.prototype.pull = function () {
	console.log('pulling')
}

function write_juicebox(juicebox_name) {
	return new Promise(function(resolve, reject){
		fstream.Reader({ 'path': path.join(CMD_FOLDER, 'cms'), 'type': 'Directory' })
			.pipe(tar.Pack())
			.pipe(zlib.Gzip())
			.pipe(fstream.Writer({ 'path': path.join('juicebox', juicebox_name) })
				.on('close', function() {
					resolve()
				})
			)
	})
}

function write_juicefile(juice) {
	return new Promise(function(resolve, reject){
		fs.writeFile( path.join(CMD_FOLDER, 'juicebox', 'juice.json') , JSON.stringify(juice), function(err) {
			if(err) {
				reject()
			}


			resolve()
		})
	})
}

function upload_juice_to_remote() {

}

module.exports = new juicebox()