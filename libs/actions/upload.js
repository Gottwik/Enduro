// * ———————————————————————————————————————————————————————— * //
// * 	enduro.actions.upload
// * ———————————————————————————————————————————————————————— * //

var action = function () {}

action.prototype.action = function (url) {
	return require(enduro.enduro_path + '/libs/cli_tools/cli_upload').cli_upload(url)
}

module.exports = new action()
