// * ———————————————————————————————————————————————————————— * //
// * 	juice helpers
// * ———————————————————————————————————————————————————————— * //
var juice_helpers = function () {}

// vendor dependencies
var dircompare = require('dir-compare');
var path = require('path')

juice_helpers.prototype.diff_with_cms = function(folder) {
	return new Promise(function(resolve, reject){

		var options = {compareSize: true};
		var path1 = path.join(CMD_FOLDER, 'cms');
		var path2 = path.join(CMD_FOLDER, folder);
		var res = dircompare.compareSync(path1, path2, options);
		console.log('equal: ' + res.equal);
		console.log('distinct: ' + res.distinct);
		console.log('local: ' + res.left);
		console.log('juiced: ' + res.right);
		console.log('differences: ' + res.differences);
		console.log('same: ' + res.same);
		var format = require('util').format;
		res.diffSet.forEach(function (entry) {
			var state = {
				'equal' : ' == ',
				'left' : ' -> ',
				'right' : ' <- ',
				'distinct' : ' <> '
			}[entry.state];
			var name1 = entry.name1 ? entry.name1 : '';
			var name2 = entry.name2 ? entry.name2 : '';

			// files are different
			//if(entry.state == 'distinct') {
				console.log(format('%s(%s)[%s]%s%s(%s)[%s]', name1, entry.type1, entry.date1, state, name2, entry.type2, entry.date2));
			//}
		});
	})
}

module.exports = new juice_helpers()