// * ———————————————————————————————————————————————————————— * //
// * 	juicebox
// *	deals with lack of persistent storage plus adds backup and versioning
// * ———————————————————————————————————————————————————————— * //
const juicebox = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const tar = require('tar')
const path = require('path')
const fs = Promise.promisifyAll(require('fs-extra'))
const rimraf = Promise.promisify(require('rimraf'))

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')
const remote_handler = require(enduro.enduro_path + '/libs/remote_tools/remote_handler')
const juice_helpers = require(enduro.enduro_path + '/libs/juicebox/juice_helpers')
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const log_clusters = require(enduro.enduro_path + '/libs/log_clusters/log_clusters')

const EXTENSION = '.tar.gz'

// packs up the juicebox together with new juice.json
juicebox.prototype.pack = function (user) {
	const self = this

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
	const self = this

	// if juicebox is not enabled or disabled by flags
	if (!enduro.config.juicebox_enabled) {
		return Promise.resolve()
	}

	logger.init('Juice pull')

	let pull_juice

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
				// we will spill the just created juicebox instead so we have the first
				return self.force_pack('enduro.js')
					.then(() => {
						return spill_the_juice(pull_juice.latest.hash + EXTENSION, path.join(enduro.project_path, 'juicebox', 'staging', pull_juice.latest.hash))
					})
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

// * ———————————————————————————————————————————————————————— * //
// * 	diff current to latest juicebox
// * 	will compare current cms folder and latest staged juicebox diff
// * ———————————————————————————————————————————————————————— * //
juicebox.prototype.diff_current_to_latest_juicebox = function () {
	const self = this

	return get_latest_local_juice()
		.then((latest_local_juicebox_hash) => {
			return juice_helpers.get_diff_folder_with_cms(path.join('juicebox', 'staging', latest_local_juicebox_hash, 'cms'))
		})
}

juicebox.prototype.diff = function (version_hash, file) {

	// will store the specified juicebox hash
	let juicebox_hash_to_diff

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
				return juice_helpers.get_diff_folder_with_cms(path.join('juicebox', 'staging', juicebox_hash_to_diff, 'cms'))
			}
		})
}

juicebox.prototype.log = function (nojuice) {
	return get_latest_juice()
		.then((juice) => {
			juice_helpers.nice_log(juice)
		})
}

juicebox.prototype.is_juicebox_enabled = function () {
	const juicefile_path = path.join(enduro.project_path, 'juicebox', 'juice.json')
	return !flat_helpers.file_exists_sync(juicefile_path)
}

function write_juicebox (juicebox_name) {
	return tar.create({
		gzip: true,
		file: path.join(enduro.project_path, 'juicebox', juicebox_name),
		cwd: enduro.project_path
	},
	[ 'cms' ]
	)
}

function write_juicefile (juice) {
	return new Promise(function (resolve, reject) {
		const destination_juicefile_path = path.join(enduro.project_path, 'juicebox', 'juice.json')
		flat_helpers.ensure_directory_existence(destination_juicefile_path)
			.then(() => {
				fs.writeFile(destination_juicefile_path, JSON.stringify(juice), function (err) {
					if (err) { reject(err) }
					resolve(juice)
				})
			})
	})
}

function read_juicefile () {
	const local_juicefile_path = path.join(enduro.project_path, 'juicebox', 'juice.json')

	return fs.readJson(local_juicefile_path)
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
					logger.raw_err(body)
				}
				process.exit()
			}

			if (response.statusCode != 200) { reject('couldnt read juice file') }

			// check if we got xml or json - xml means there is something wrong
			const juicefile_in_json = JSON.parse(body)

			return write_juicefile(juicefile_in_json)
		})
		.catch(() => {
			return write_juicefile(get_new_juicefile())
		})
}

// gets latest juice from the local juice.json
function get_latest_local_juice () {
	return read_juicefile()
		.then((latest_juicebox_data) => {
			return latest_juicebox_data.latest.hash
		})
}

function get_juicebox_hash_by_timestamp (timestamp) {
	return enduro.config.project_name + '_' + timestamp
}

function get_juicebox_by_name (juicebox_name) {
	const source_path = remote_handler.get_remote_url('juicebox/' + juicebox_name, true)
	const destination_path = path.join(enduro.project_path, 'juicebox', juicebox_name)

	if (source_path == destination_path) {
		return new Promise.resolve(juicebox_name)
	}

	return new Promise(function (resolve, reject) {
		const juicebox_read_stream = remote_handler.request_stream(source_path)

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

	// yea, we need the juicebox name
	if (!juicebox_name) {
		return Promise.resolve()
	}

	const tarball_location = path.join(enduro.project_path, 'juicebox', juicebox_name)

	// delete the folder if it exists
	return rimraf(path.join(destination, 'cms'))
		.then(() => {
			return flat_helpers.file_exists(tarball_location)
		})
		.then(() => {
			return flat_helpers.ensure_directory_existence(path.join(destination, 'fake.txt'))
		})
		.then(() => {
			return tar.extract({
				file: tarball_location,
				cwd: destination,
			})
		})
}

// provides default context of a fresh juicefile
function get_new_juicefile () {

	const timestamp = Math.floor(Date.now() / 1000)

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
	throw new Error('abort promise chain', err)
}

module.exports = new juicebox()
