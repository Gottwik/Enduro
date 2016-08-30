//	placeholder abstractor

var abstractor = function () {}

abstractor.prototype.abstract = function (context) {
	return new Promise(function (resolve, reject) {

		// abstract directive
		return resolve()

	})
}

module.exports = new abstractor()
