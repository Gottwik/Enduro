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
var juice_helpers = require(ENDURO_FOLDER + '/libs/juicebox/juice_helpers')

var EXTENSION = '.tar.gz'

// packs up the juicebox together with new juice.json
juicebox.prototype.pack = function (user) {

	var self = this

	return self.pull()
		.then(() => {
			return self.force_pack(user)
		})
}

juicebox.prototype.pull = function (nojuice) {

	if(nojuice || !config.variables.juicebox_enabled) {
		return Promise.resolve()
	}

	kiska_logger.init('Juice pull')

	if(flags.force) {
			return get_latest_juice()
				.then((juice) => {
					return get_juicebox_by_name(juice.latest.hash + EXTENSION)
				})
				.then((latest_juicebox) => {
					return spill_the_juice(latest_juicebox)
				})
				.then(() => {
					kiska_logger.end()
					return Promise.resolve()
				})
	} else {

		var pull_juice

		return get_latest_juice()
			.then((juice) => {
				pull_juice = juice
				return get_juicebox_by_name(juice.latest.hash + EXTENSION)
			})
			.then((latest_juicebox) => {
				return spill_the_juice(latest_juicebox, path.join('juicebox', 'staging', pull_juice.latest.hash))
			})
			.then(() => {
				return juice_helpers.spill_newer(path.join('juicebox', 'staging', pull_juice.latest.hash))
			})
			.then(() => {
				kiska_logger.end()
				return Promise.resolve()
			})
	}
}

// packs up the juicebox together with new juice.json
juicebox.prototype.force_pack = function (user) {
	return new Promise(function(resolve, reject){

		// sets user to developer if juicing is caused by console
		user = user || 'developer'

		// Skip juicing if juicing is not enabled(most likely s3 keys are missing)
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
						kiska_logger.init('Juice pack')
						kiska_logger.log('packed successfully')
						kiska_logger.end()
						resolve()
					})
			})
	})
}

juicebox.prototype.diff = function (nojuice) {
	console.log('diff')

	var diff_juice

	return get_latest_juice()
		.then((juice) => {
			diff_juice = juice
			return get_juicebox_by_name(juice.latest.hash + EXTENSION)
		})
		.then((latest_juicebox) => {
			return spill_the_juice(latest_juicebox, path.join('juicebox', 'staging', diff_juice.latest.hash))
		})
		.then(() => {
			juice_helpers.diff_with_cms(path.join('juicebox', 'staging', diff_juice.latest.hash, 'cms'))
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

function spill_the_juice(juicebox_name, destination) {

	destination = destination || path.join(CMD_FOLDER)

	return new Promise(function(resolve, reject){

		var tarball = path.join(CMD_FOLDER, 'juicebox', juicebox_name)

		fs.createReadStream(tarball)
			.pipe(zlib.Unzip())
			.pipe(tar.Extract({
				path: destination,
			}))
			.on('end', function() {
				resolve()
			})
	})
}



module.exports = new juicebox()