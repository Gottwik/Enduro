// * ———————————————————————————————————————————————————————— * //
// * 	render
// *	renders all the static files - no server started
// * ———————————————————————————————————————————————————————— * //

var render_action = function () {}

var Promise = require('bluebird')

var logger = require(enduro.enduro_path + '/libs/logger')
var juicebox = require(enduro.enduro_path + '/libs/juicebox/juicebox')
var global_data = require(enduro.enduro_path + '/libs/global_data')
var helper_handler = require(enduro.enduro_path + '/libs/helper_handler')
var components_handler = require(enduro.enduro_path + '/libs/components_handler')
var enduro_render = require(enduro.enduro_path + '/libs/enduro_render')
var gulp = require(enduro.enduro_path + '/gulpfile')
var pregenerator = require(enduro.enduro_path + '/libs/pregenerator/pregenerator')
var abstractor = require(enduro.enduro_path + '/libs/abstractor/abstractor')
var ab_tester = require(enduro.enduro_path + '/libs/ab_testing/ab_tester')
var markdownifier = require(enduro.enduro_path + '/libs/markdown/markdownifier')

render_action.prototype.action = function (callback, dont_do_juice_pull) {

	logger.init('Enduro', 'enduro_render_events')
	return Promise.resolve()
		.then(() => {
			if (!dont_do_juice_pull) {
				return juicebox.pull(juicebox.is_juicebox_enabled())
			} else {
				return new Promise.resolve()
			}
		})
		.then(() => {
			return global_data.get_global_data()
		})
		.then(() => {
			return components_handler.read_components()
		})
		.then(() => {
			return helper_handler.read_helpers()
		})
		.then(() => {
			return abstractor.init()
		})
		.then(() => {
			return markdownifier.precompute()
		})
		.then(() => {
			return ab_tester.generate_global_ab_list()
		})
		.then(() => {
			return pregenerator.pregenerate()
		})
		.then(() => {
			return new Promise(function (resolve, reject) {
				return gulp.start('preproduction', () => {
					resolve()
				})
			})
		})
		.then(() => {
			return enduro_render.render()
		})
		.then(() => {
			return new Promise(function (resolve, reject) {
				return gulp.start('production', () => {
					resolve()
				})
			})
		})
		.then(() => {
			logger.end('enduro_render_events')
			if (callback) {
				callback()
			}
		})
}


module.exports = new render_action()