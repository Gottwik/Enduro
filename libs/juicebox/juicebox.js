// * ———————————————————————————————————————————————————————— * //
// * 	juicebox
// *	deals with lack of persistent storage plus adds backup and versioning
// * ———————————————————————————————————————————————————————— * //
var juicebox = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fstream = require('fstream')
var tar = require('tar')
var zlib = require('zlib')
var path = require('path')
var fs = require('fs')
var rimraf = require('rimraf')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')
var remote_handler = require(enduro.enduro_path + '/libs/remote_tools/remote_handler')
var juice_helpers = require(enduro.enduro_path + '/libs/juicebox/juice_helpers')
var flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
var log_clusters = require(enduro.enduro_path + '/libs/log_clusters/log_clusters')

var EXTENSION = '.tar.gz'

// packs up the juicebox together with new juice.json
juicebox.prototype.pack = function (user) {
	var self = this

	return self.pull()
		.then(() => {
			return self.force_pack(user)
		})
}

// * ———————————————————————————————————————————————————————— * //
// * 	pull
// *
// * 	gets the most recent file from the juicebar
// *	@param {bool} force - overwrites newer files on local
// *	@return {promise} - no data
// * ———————————————————————————————————————————————————————— * //
juicebox.prototype.pull = function (force) {
	var self = this

	// if juicebox is not enabled or disabled by flags
	if (!enduro.config.juicebox_enabled || enduro.flags.nojuice) {
		return Promise.resolve()
	}

	logger.init('Juice pull')

	var pull_juice

	if (enduro.flags.force || force) {
		return get_latest_juice()
			.then((juice) => {
				pull_juice = juice
				return get_juicebox_by_name(juice.latest.hash + EXTENSION)
			}, err)
			.then((latest_juicebox) => {
				return spill_the_juice(latest_juicebox)
			}, () => {
				// latest juicebox does not exist
				return self.force_pack('enduro.js')
			})
			.then(() => {
				logger.end()
				return Promise.resolve(pull_juice.latest.hash)
			})
	} else {
		return get_latest_juice()
			.then((juice) => {
				pull_juice = juice
				return get_juicebox_by_name(juice.latest.hash + EXTENSION)
			}, err)

			.then((latest_juicebox) => {
				return spill_the_juice(latest_juicebox, path.join(enduro.project_path, 'juicebox', 'staging', pull_juice.latest.hash))
			}, () => {
				// latest juicebox does not exist
				return self.force_pack('enduro.js')
					.then(() => {
						throw new Error('abort promise chain')
					})
			})

			.then(() => {
				return juice_helpers.spill_newer(path.join('juicebox', 'staging', pull_juice.latest.hash))
			}, () => {})

			.then(() => {
				logger.end()
				return Promise.resolve(pull_juice.latest.hash)
			})
	}
}

// packs up the juicebox together with new juice.json
juicebox.prototype.force_pack = function (user) {
	return new Promise(function (resolve, reject) {

		// sets user to developer if juicing is caused by console
		user = user || 'developer'

		// skip juicing if juicing is not enabled or disabled by flags
		if (!enduro.config.juicebox_enabled || enduro.flags.nojuice) {
			return resolve()
		}

		get_latest_juice()
			.then((juice) => {
				juice.history = juice.history || []

				if (juice.latest) {
					juice.history.push(juice.latest)
				}

				juice.latest = {
					hash: get_juicebox_hash_by_timestamp(Math.floor(Date.now() / 1000)),
					timestamp: Math.floor(Date.now() / 1000),
					user: user,
				}

				write_juicebox(juice.latest.hash + EXTENSION)
					.then(() => {
						return write_juicefile(juice)
					})
					.then(() => {
						return remote_handler.upload_to_filesystem_by_filepath('juicebox/juice.json', path.join(enduro.project_path, 'juicebox', 'juice.json'))
					})
					.then(() => {
						return remote_handler.upload_to_filesystem_by_filepath('juicebox/' + juice.latest.hash + EXTENSION, path.join(enduro.project_path, 'juicebox', juice.latest.hash + EXTENSION))
					})
					.then(() => {
						logger.init('Juice pack')
						logger.log('packed successfully')
						logger.end()
						resolve()
					})
			})
	})
}

juicebox.prototype.diff = function (version_hash, file) {

	// will store the specified juicebox hash
	var juicebox_hash_to_diff

	return get_latest_juice()
		.then((juice) => {
			// if user provided specified version
			if (version_hash) {
				juicebox_hash_to_diff = get_juicebox_hash_by_timestamp(version_hash)
			} else {
				juicebox_hash_to_diff = juice.latest.hash
			}

			return get_juicebox_by_name(juicebox_hash_to_diff + EXTENSION)
		})
		.then((specified_juicebox) => {
			return spill_the_juice(specified_juicebox, path.join('juicebox', 'staging', juicebox_hash_to_diff))
		}, (e) => {
			logger.err(e)
		})
		.then(() => {
			if (file) {
				return juice_helpers.diff_file_with_cms(juicebox_hash_to_diff, file)
			} else {
				return juice_helpers.diff_folder_with_cms(path.join('juicebox', 'staging', juicebox_hash_to_diff, 'cms'))
			}
		})
}

juicebox.prototype.log = function (nojuice) {
	return get_latest_juice()
		.then((juice) => {
			juice_helpers.nice_log(juice)
		})
}

juicebox.prototype.juicebox_enabled = function () {
	return enduro.config.juicebox_enabled && !enduro.flags.nojuice
}

juicebox.prototype.is_juicebox_enabled = function () {
	var juicefile_path = path.join(enduro.project_path, 'juicebox', 'juice.json')
	return !flat_helpers.file_exists_sync(juicefile_path)
}

function write_juicebox (juicebox_name) {
	return new Promise(function (resolve, reject) {
		fstream.Reader({ 'path': path.join(enduro.project_path, 'cms'), 'type': 'Directory' })
			.pipe(tar.Pack())
			.pipe(zlib.Gzip())
			.pipe(fstream.Writer({ 'path': path.join(enduro.project_path, 'juicebox', juicebox_name) })
				.on('close', function () {
					resolve()
				})
			)
	})
}

function write_juicefile (juice) {
	return new Promise(function (resolve, reject) {
		var destination_juicefile_path = path.join(enduro.project_path, 'juicebox', 'juice.json')
		flat_helpers.ensure_directory_existence(destination_juicefile_path)
			.then(() => {
				fs.writeFile(destination_juicefile_path, JSON.stringify(juice), function (err) {
					if (err) { reject(err) }
					resolve(juice)
				})
			})
	})
}

function get_latest_juice () {
	return remote_handler.request_file(remote_handler.get_remote_url('juicebox/juice.json', true))
		.catch(() => {
			throw new Error('latest juice does not exist')
		})
		.spread((body, response) => {

			if (body.indexOf('<?xml') + 1 && body.indexOf('<Error>') + 1) {

				// juicefile doesn't exist yet - let's create a new juicefile
				if (body.indexOf('AccessDenied') + 1) {
					log_clusters.log('bucket_access_denied')
				// bucket was not created
				} else if (body.indexOf('NoSuchBucket') + 1) {
					log_clusters.log('nonexistent_bucket')
				} else {
					console.log(body)
				}
				process.exit()
			}

			if (response.statusCode != 200) { reject('couldnt read juice file') }

			// check if we got xml or json - xml means there is something wrong
			var juicefile_in_json = JSON.parse(body)

			return write_juicefile(juicefile_in_json)
		})
		.catch(() => {
			return write_juicefile(get_new_juicefile())
		})
}

function get_juicebox_hash_by_timestamp (timestamp) {
	return enduro.config.project_name + '_' + timestamp
}

function get_juicebox_by_name (juicebox_name) {
	var source_path = remote_handler.get_remote_url('juicebox/' + juicebox_name, true)
	var destination_path = path.join(enduro.project_path, 'juicebox', juicebox_name)

	if (source_path == destination_path) {
		return new Promise.resolve(juicebox_name)
	}

	return new Promise(function (resolve, reject) {
		var juicebox_read_stream = remote_handler.request_stream(source_path)

		juicebox_read_stream
			.on('error', () => {
				return reject()
			})

		juicebox_read_stream.pipe(fs.createWriteStream(destination_path)
				.on('close', function () {
					resolve(juicebox_name)
				})
			)
	})
}

function spill_the_juice (juicebox_name, destination) {
	// default destination is the project's root (juicebox has cms folder)
	destination = destination || path.join(enduro.project_path)

	return new Promise(function (resolve, reject) {
		// delete the folder if it exists
		rimraf(path.join(destination, 'cms'), function () {

			if (!juicebox_name || juicebox_name == '0000.tar.gz') {
				return resolve()
			}

			var tarball = path.join(enduro.project_path, 'juicebox', juicebox_name)

			if (flat_helpers.file_exists_sync(tarball)) {
				var tar_extract = tar.Extract({
					path: destination,
				})

				fs.createReadStream(tarball)
					.pipe(zlib.Unzip())
					.on('error', function () {
						log_clusters.log('extraction_failed')
					})
					.pipe(tar_extract)

				tar_extract.on('finish', () => {
					resolve()
				})
			}
		})
	})
}

// provides default context of a fresh juicefile
function get_new_juicefile () {

	var timestamp = Math.floor(Date.now() / 1000)

	return {
		history: [],
		latest: {
			hash: get_juicebox_hash_by_timestamp(timestamp),
			timestamp: Math.floor(Date.now() / 1000),
			user: 'first_juicebox',
		}
	}
}

// handles errors
function err (err) {
	throw new Error('abort promise chain')
}

module.exports = new juicebox()
