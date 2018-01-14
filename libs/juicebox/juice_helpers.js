// * ———————————————————————————————————————————————————————— * //
// * 	juice helpers
// *	TODO: nicer logging
// * ———————————————————————————————————————————————————————— * //
const juice_helpers = function () {}

// * vendor dependencies
const dircompare = require('dir-compare')
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment')
const glob = require('glob-promise')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')
const flat_helpers = require(enduro.enduro_path + '/libs/flat_db/flat_helpers')
const juice_diff = require(enduro.enduro_path + '/libs/juicebox/juice_diff')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')

// * ———————————————————————————————————————————————————————— * //
// * 	print out diff folder with cms
// * ———————————————————————————————————————————————————————— * //
juice_helpers.prototype.print_out_diff_folder_with_cms = function (folder) {
	const local_path = path.join(enduro.project_path, 'cms')
	const juice_path = path.join(enduro.project_path, folder)

	return juice_diff.print_out_diff(local_path, juice_path)
}

// * ———————————————————————————————————————————————————————— * //
// * 	get diff folder with cms
// * ———————————————————————————————————————————————————————— * //
juice_helpers.prototype.get_diff_folder_with_cms = function (folder) {
	const local_path = path.join(enduro.project_path, 'cms')
	const juice_path = path.join(enduro.project_path, folder)

	return juice_diff.diff(local_path, juice_path)
}

// * ———————————————————————————————————————————————————————— * //
// * 	diff file with cms
// * ———————————————————————————————————————————————————————— * //
juice_helpers.prototype.diff_file_with_cms = function (juicebox_hash, file) {
	glob(path.join(enduro.project_path, 'juicebox', 'staging', juicebox_hash, '**', file + '.js'))
		.then((file) => {
			if (!file.length) {
				return logger.err('no such file')
			}

			if (file.length > 1) {
				console.log(file)
				return logger.err('More than one file')
			}

			// get paths for both files
			const staging_file_to_diff = file[0]
			const current_file_to_diff = flat.get_full_path_to_flat_object(staging_file_to_diff.match(/\/cms\/(.*)/)[1]).replace('.js.js', '.js')

			const spawn = require('child_process').exec

			spawn('diff "' + staging_file_to_diff + '" "' + current_file_to_diff + '"', [], function (err, stdout, stderr) {
				if (err) { logger.err(err) } // handled error

				console.log(stdout)
			})

			spawn.stdout.on('data', function (data) {
				console.log('stdout: ' + data)
			})
		})

}

juice_helpers.prototype.spill_newer = function (folder) {
	return new Promise(function (resolve, reject) {
		if (!flat_helpers.dir_exists_sync(folder)) {
			return resolve()
		}

		diff = get_diff(folder)

		copy_stack = []

		diff.diffSet.forEach(function (entry) {

			if (entry.type1 != 'directory') {
				// remote is newer
				if (entry.date2 > entry.date1) {
					logger.twolog('newer in juicebar', entry.name2)
					copy_stack.push(copy_file_to_cms(entry))
				}

				// only on remote
				if (entry.state == 'right') {
					logger.twolog('new file in juicebar', entry.name2)
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

// * ———————————————————————————————————————————————————————— * //
// *	nice_log
// * 	logs latest juiceboxes
// *
// *	@param juice {object} - fetched juice.json
// *	@param maxrows {int} - maximum number of rows logged. defaults to 20.
// *	returns nothing - just logs out stuff
// * ———————————————————————————————————————————————————————— * //
juice_helpers.prototype.nice_log = function (juice, maxrows) {

	const history_length = juice.history.length
	maxrows = Math.min(maxrows | 20, history_length)

	logger.init('Juice log')
	logger.log('latest')
	log_record(juice.latest)
	logger.line()

	for (let i = 0; i < maxrows; i++) {
		log_record(juice.history[history_length - i - 1])
	}
	logger.end()
}

// * ———————————————————————————————————————————————————————— * //
// *	log_record
// * 	logs one record
// *
// *	@param record {object} - object with a record. { hash:'', user: '', timestamp: '' }
// *	returns nothing - just logs out stuff
// * ———————————————————————————————————————————————————————— * //
function log_record (record) {
	logger.twolog(record.hash.match(/_(.*)/)[1] + ' (' + record.user + ')', moment.unix(record.timestamp).fromNow())
}

function get_diff (folder) {
	const path1 = path.join(enduro.project_path, 'cms')
	const path2 = path.join(enduro.project_path, folder, 'cms')
	return dircompare.compareSync(path1, path2, {compareSize: true})
}

function copy_file_to_cms (entry) {
	return new Promise(function (resolve, reject) {

		const from_path = path.join(entry.path2, entry.name2)
		const to_path = path.join(enduro.project_path, 'cms', path.join(entry.path2, entry.name2).match(/\/cms\/(.*)/)[1])

		fs.copy(from_path, to_path, {preserveTimestamps: true}, () => {
			resolve()
		})
	})
}

module.exports = new juice_helpers()
