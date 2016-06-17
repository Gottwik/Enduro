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
var request = require('request')

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')
var remote_handler = require(ENDURO_FOLDER + '/libs/remote_tools/remote_handler')

var EXTENSION = '.tar.gz'

// packs up the juicebox together with new juice.json
juicebox.prototype.pack = function (user) {

	return new Promise(function(resolve, reject){

		user = user || 'developer'

		if(!config.variables.juicebox_enabled) {
			resolve()
			return kiska_logger.log('juicebox not enabled')
		}

		get_latest_juice()
			.then((juice) => {
				juice.history = juice.history || []

				if(juice.latest) {
					juice.history.push(juice.latest)
				}

				juice.latest = {
					hash: config.project_name + '_' + Math.floor(Date.now() / 1000),
					timestamp: Math.floor(Date.now() / 1000),
					user: user,
				}

				write_juicebox(juice.latest.hash + EXTENSION)
					.then(() => {
						return write_juicefile(juice)
					})
					.then(() => {
						return remote_handler.upload_to_s3_by_filepath('juicebox/juice.json', path.join(CMD_FOLDER, 'juicebox', 'juice.json'))
					})
					.then(() => {
						return remote_handler.upload_to_s3_by_filepath('juicebox/' + juice.latest.hash + EXTENSION, path.join(CMD_FOLDER, 'juicebox', juice.latest.hash + EXTENSION))
					})
					.then(() => {
						kiska_logger.init('Juice')
						kiska_logger.log('Juice packed successfully')
						kiska_logger.end()
						return Promise.resolve()
					})
			})
	})
}

juicebox.prototype.pull = function (nojuice) {

	if(nojuice) {
		return Promise.resolve()
	}

	console.log('pulling')
	return get_latest_juice()
		.then((juice) => {
			return get_juicebox_by_name(juice.latest.hash + EXTENSION)
		})
		.then((latest_juicebox) => {
			return spill_the_juice(latest_juicebox)
		})
		.then(() => {
			kiska_logger.init('Juice')
			kiska_logger.log('Juice pulled successfully')
			kiska_logger.end()
			return Promise.resolve()
		})
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
			if(err) { reject() }
			resolve()
		})
	})
}

function get_latest_juice() {
	return new Promise(function(resolve, reject){
		request(remote_handler.get_remote_url('juicebox/juice.json'), function (error, response, body) {
			if (error && response.statusCode != 200) { reject('couldnt read juice file') }
				write_juicefile(JSON.parse(body))
					.then(() => {
						resolve(JSON.parse(body))
					})
		})

	})
}

function get_juicebox_by_name(juicebox_name) {
	return new Promise(function(resolve, reject){
		request(remote_handler.get_remote_url('juicebox/' + juicebox_name))
			.pipe(fs.createWriteStream('juicebox/' + juicebox_name)
				.on('close', function() {
					resolve(juicebox_name)
				})
			)
	})
}

function spill_the_juice(juicebox_name) {
	return new Promise(function(resolve, reject){

		var tarball = path.join(CMD_FOLDER, 'juicebox', juicebox_name)
		var dest = path.join(CMD_FOLDER)

		fs.createReadStream(tarball)
			.pipe(zlib.Unzip())
			.pipe(tar.Extract({
				path: dest,
			}))
			.on('end', function() {
				resolve()
			})
	})
}



module.exports = new juicebox()