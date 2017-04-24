// vendor dependencies
var spritesmith = require('gulp.spritesmith')
var path = require('path')

// local dependencies
var logger = require(enduro.enduro_path + '/libs/logger')

// * ———————————————————————————————————————————————————————— * //
// * 	spriteicons
// *	will get all pngs out of assets/spriteicons folder
// *	and generate spritesheet out of them
// * ———————————————————————————————————————————————————————— * //
var sprite_icons = function () {}

sprite_icons.prototype.init = function (gulp, browser_sync) {

	// stores task name
	var sprite_icons_task_name = 'png_sprites'

	// registeres task to provided gulp
	gulp.task(sprite_icons_task_name, function () {

		return gulp.src(enduro.project_path + '/assets/spriteicons/*.png')
			.pipe(spritesmith({
				imgName: enduro.config.build_folder + '/assets/spriteicons/spritesheet.png',
				cssName: enduro.config.build_folder + '/_prebuilt/sprites.scss',
				padding: 3,
				cssTemplate: path.join(enduro.enduro_path, 'support_files', 'sprite_generator.handlebars'),
				retinaSrcFilter: [path.join(enduro.project_path, 'assets/spriteicons/*@2x.png')],
				retinaImgName: enduro.config.build_folder + '/assets/spriteicons/spritesheet@2x.png',
			}))
			.pipe(gulp.dest(enduro.project_path))

	})

	return sprite_icons_task_name
}

module.exports = new sprite_icons()
