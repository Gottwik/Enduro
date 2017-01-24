// * ———————————————————————————————————————————————————————— * //
// * 	cli upload
// *	uploads image by providing a link by running:
// *	enduro upload http://www.imgur.com/asd.png
// * ———————————————————————————————————————————————————————— * //
var cli_upload = function () {}

// local variables
var file_uploader = require(ENDURO_FOLDER + '/libs/admin_utilities/file_uploader')

// * ———————————————————————————————————————————————————————— * //
// * 	cli upload
// * 	generates object based on flag array
// *
// *	@return {string} - url for uploaded link
// * ———————————————————————————————————————————————————————— * //
cli_upload.prototype.cli_upload = function (file_url) {
	file_uploader.upload_by_url(file_url)
}

module.exports = new cli_upload()
