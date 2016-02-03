var fs = require('fs')

var enduro_helpers = function () {};

// Checks if file exists
enduro_helpers.prototype.fileExists = function (filePath) {
	try {
		return fs.statSync(filePath).isFile();
	}
	catch (err) { return false; }
}

module.exports = new enduro_helpers()