var fs = require('fs')

var k7_helpers = function () {};

k7_helpers.prototype.fileExists = function (filePath) {
	try {
		return fs.statSync(filePath).isFile();
	}
	catch (err) { return false; }
}

module.exports = new k7_helpers()