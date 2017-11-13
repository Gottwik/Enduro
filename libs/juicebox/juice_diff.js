// * ———————————————————————————————————————————————————————— * //
// * 	juice diff
// *
// * 	diff posibilities:
// * 		equal
// *		local_only
// * 		juice_only
// * 		local_newer
// * 		juice_newer
// *
// * ———————————————————————————————————————————————————————— * //
const juice_diff = function () {}

// * vendor dependencies
const dircompare = require('dir-compare')
const _ = require('lodash')
const path = require('path')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')
const flat = require(enduro.enduro_path + '/libs/flat_db/flat')

// * ———————————————————————————————————————————————————————— * //
// * 	print out diff
// * ———————————————————————————————————————————————————————— * //
juice_diff.prototype.print_out_diff = function (diff) {
	const self = this
	logger.init('Juice diff')

	diff.diffSet.forEach((item) => {
		if (item.type == 'directory') {
			logger.log(item.indentation + item.name)
		} else {
			logger.twolog(item.indentation + item.name, item.status)
		}
	})
	
	logger.end()
}

juice_diff.prototype.diff = function (path1, path2) {

	let store_compare_result
	return dircompare.compare(path1, path2)
		.then((compare_result) => {

			store_compare_result = compare_result

			// filter out ds_store files
			_.remove(compare_result.diffSet, function (file) {
				return (file.name1 == '.DS_Store' || file.name2 == '.DS_Store')
			})

			let abstract_cms_files = []
			compare_result.diffSet.forEach((item) => {
				abstract_cms_files.push(abstract_diff_item(item))
			})

			return Promise.all(abstract_cms_files)
		})
		.then(() => {
			// let's count all the differences
			store_compare_result.differences = 0
			for (let i in store_compare_result.diffSet) {
				const diff_item = store_compare_result.diffSet[i]
				if (diff_item.type == 'file' && diff_item.status != 'equal') {
					store_compare_result.differences++;
				}
			}
			return store_compare_result
		})
		.then(() => {
			return store_compare_result
		})
}

// adds name and path
function abstract_diff_item (item) {

	item.filename = item.name1 || item.name2
	item.name = item.filename
	item.type = item.type1 || item.type2
	item.indentation = Array((item.level) * 4).join(' ')

	if (item.type == 'directory') {
		return
	}

	// juice_only
	if (item.type1 == 'missing') {
		return item.status = 'juice_only'
	}

	// local_only
	if (item.type2 == 'missing') {
		return item.status = 'local_only'
	}

	item.fullpath1 = path.join(item.path1, item.name1)
	item.fullpath2 = path.join(item.path2, item.name2)

	let read_both_files_timestamps = []

	read_both_files_timestamps.push(flat.load(item.fullpath1, true)
		.then((context) => {
			item.juicetimestamp1 = figure_out_timestamp(context)
		}))

	read_both_files_timestamps.push(flat.load(item.fullpath2, true)
		.then((context) => {
			item.juicetimestamp2 = figure_out_timestamp(context)
		}))

	return Promise.all(read_both_files_timestamps)
		.then(() => {
			figure_out_status(item)
		})

}

// extracts timestamp from meta
function figure_out_timestamp (context) {
	if (!context || !context.meta || !context.meta.last_edited) {
		return 0 // if meta timestamp is missing, assume this file is the old
	}

	return context.meta.last_edited
}

function figure_out_status (item) {
	// if both files don't have meta timestamp compare creation times
	if (!item.juicetimestamp1 && !item.juicetimestamp2) {
		item.status = 'equal'
	}

	// local_newer
	if (item.juicetimestamp1 > item.juicetimestamp2) {
		return item.status = 'local_newer'
	}

	// juice_newer
	if (item.juicetimestamp1 < item.juicetimestamp2) {
		return item.status = 'juice_newer'
	}

	item.status = 'equal'
}

module.exports = new juice_diff()
