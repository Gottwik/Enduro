// * ———————————————————————————————————————————————————————— * //
// * 	juicebox
// *	deals with lack of persistent storage
// *	TODO: juicefiles are public. maybe not the best idea
// * ———————————————————————————————————————————————————————— * //
var juicebox = function () {}

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
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var log_clusters = require(ENDURO_FOLDER + '/libs/log_clusters/log_clusters')

var EXTENSION = '.tar.gz'

// packs up the juicebox together with new juice.json
juicebox.prototype.pack = function (user) {
	var self = this

	return self.pull()
		.then(() => {
			return self.force_pack(user)
		})
}

juicebox.prototype.pull = function (nojuice, force) {

	if (nojuice || !config.variables.juicebox_enabled) {
		return Promise.resolve()
	}

	kiska_logger.init('Juice pull')

	if (flags.force || force) {
		return get_latest_juice()
			.then((juice) => {
				return get_juicebox_by_name(juice.latest.hash + EXTENSION)
			}, err)
			.then((latest_juicebox) => {
				return spill_the_juice(latest_juicebox)
			}, err)
			.then(() => {
				kiska_logger.end()
				return Promise.resolve()
			}, err)
	} else {
		var pull_juice

		return get_latest_juice()

			.then((juice) => {
				pull_juice = juice
				return get_juicebox_by_name(juice.latest.hash + EXTENSION)
			}, err)

			.then((latest_juicebox) => {
				return spill_the_juice(latest_juicebox, path.join('juicebox', 'staging', pull_juice.latest.hash))
			}, err)

			.then(() => {
				return juice_helpers.spill_newer(path.join('juicebox', 'staging', pull_juice.latest.hash))
			}, err)

			.then(() => {
				kiska_logger.end()
				return Promise.resolve()
			}, err)
	}
}

// packs up the juicebox together with new juice.json
juicebox.prototype.force_pack = function (user) {
	return new Promise(function (resolve, reject) {

		// sets user to developer if juicing is caused by console
		user = user || 'developer'

		// Skip juicing if juicing is not enabled(most likely s3 keys are missing)
		if (!config.variables.juicebox_enabled) {
			resolve()
			return kiska_logger.log('juicebox not enabled')
		}

		get_latest_juice()
			.then((juice) => {
				juice.history = juice.history || []

				if (juice.latest) {
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

juicebox.prototype.juicebox_enabled = function () {
	return config.variables.juicebox_enabled
}

juicebox.prototype.no_juice_yet = function () {
	var juicefile_path = path.join(CMD_FOLDER, 'juicebox', 'juice.json')
	return !enduro_helpers.file_exists_sync(juicefile_path)
}

function write_juicebox (juicebox_name) {
	return new Promise(function (resolve, reject) {
		fstream.Reader({ 'path': path.join(CMD_FOLDER, 'cms'), 'type': 'Directory' })
			.pipe(tar.Pack())
			.pipe(zlib.Gzip())
			.pipe(fstream.Writer({ 'path': path.join('juicebox', juicebox_name) })
				.on('close', function () {
					resolve()
				})
			)
	})
}

function write_juicefile (juice) {
	return new Promise(function (resolve, reject) {
		var destination_juicefile_path = path.join(CMD_FOLDER, 'juicebox', 'juice.json')
		enduro_helpers.ensure_directory_existence(destination_juicefile_path)
			.then(() => {
				fs.writeFile(destination_juicefile_path, JSON.stringify(juice), function (err) {
					if (err) { reject(err) }
					resolve()
				})
			})
	})
}

function get_latest_juice () {
	return new Promise(function (resolve, reject) {
		request(remote_handler.get_remote_url('juicebox/juice.json'), function (error, response, body) {
			if (error && response.statusCode != 200) { reject('couldnt read juice file') }

			var juicefile_in_json

			// check if we got xml or json - xml means there is something wrong
			if (body.indexOf('<?xml') + 1 && body.indexOf('<Error>') + 1) {

				// juicefile doesn't exist yet - let's create a new juicefile
				if (body.indexOf('AccessDenied') + 1) {
					juicefile_in_json = get_new_juicefile()

				// bucket was not created
				} else if (body.indexOf('NoSuchBucket') + 1) {
					log_clusters.log('nonexistent_bucket')

					process.exit()
				}

			} else {
				juicefile_in_json = JSON.parse(body)
			}

			write_juicefile(juicefile_in_json)
				.then(() => {
					resolve(juicefile_in_json)
				}, err)
		})

	})
}

function get_juicebox_by_name (juicebox_name) {
	return new Promise(function (resolve, reject) {
		if (juicebox_name == '0000') {
			return resolve()
		}

		request(remote_handler.get_remote_url('juicebox/' + juicebox_name))
			.pipe(fs.createWriteStream('juicebox/' + juicebox_name)
				.on('close', function () {
					resolve(juicebox_name)
				})
			)
	})
}

function spill_the_juice (juicebox_name, destination) {

	destination = destination || path.join(CMD_FOLDER)
	return new Promise(function (resolve, reject) {

		console.log(juicebox_name)
		if (!juicebox_name || juicebox_name == '0000.tar.gz') {
			return resolve()
		}

		var tarball = path.join(CMD_FOLDER, 'juicebox', juicebox_name)
		if (enduro_helpers.file_exists_sync(tarball)) {
			fs.createReadStream(tarball)
				.pipe(zlib.Unzip())
				.pipe(tar.Extract({
					path: destination,
				}))
				.on('end', function () {
					resolve()
				})
				.on('error', function () {
					console.log('asd')
				})
		}
	})
}

function get_new_juicefile () {
	return {
		history: [],
		latest: {
			hash: '0000',
			timestamp: Math.floor(Date.now() / 1000),
			user: 'enduro',
		}
	}
}

function err (err) {
	kiska_logger.raw_err(err)
}

module.exports = new juicebox()
