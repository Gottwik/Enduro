//	placeholder abstractor

var abstractor = function () {}

abstractor.prototype.init = function (context) {
	return new Promise(function (resolve, reject) {

		// initialize abstractor
		resolve()
	})
}

abstractor.prototype.abstract = function (context) {
	return new Promise(function (resolve, reject) {

		// abstract directive
		return resolve()

	})
}

module.exports = new abstractor()
