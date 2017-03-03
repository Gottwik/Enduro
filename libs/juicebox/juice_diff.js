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
var juice_diff = function () {}

// vendor dependencies
var dircompare = require('dir-compare')
var _ = require('lodash')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')

juice_diff.prototype.diff = function (path1, path2) {
	return dircompare.compare(path1, path2)
		.then((compare_result) => {
			logger.init('Juice diff')

			// filter out ds_store files
			_.remove(compare_result.diffSet, function (file) {
				return (file.name1 == '.DS_Store' || file.name2 == '.DS_Store')
			})

			compare_result.diffSet.forEach((item) => {
				abstract_diff_item(item)

				if (item.type == 'directory') {
					logger.log(item.indentation + item.name)
				} else {
					logger.twolog(item.indentation + item.name, item.status)
				}
			})
			logger.end()

			return Promise.resolve(compare_result)
		})
}

// adds name and path
function abstract_diff_item (item) {
	item.filename = item.name1 || item.name2
	item.name = item.filename
	item.type = item.type1 || item.type2
	item.indentation = Array((item.level) * 4).join(' ')

	// juice_only
	if (item.type1 == 'missing') {
		return item.status = 'juice_only'
	}

	// local_only
	if (item.type2 == 'missing') {
		return item.status = 'local_only'
	}

	// local_newer
	if (item.date1 > item.date2) {
		return item.status = 'local_newer'
	}

	// juice_newer
	if (item.date1 < item.date2) {
		return item.status = 'juice_newer'
	}

	item.status = 'equal'
}

module.exports = new juice_diff()
