// vendor dependencies
var spritesmith = require('gulp.spritesmith')
var path = require('path')

// local dependencies
var logger = require(ENDURO_FOLDER + '/libs/logger')

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

		return gulp.src(CMD_FOLDER + '/assets/spriteicons/*.png')
			.pipe(spritesmith({
				imgName: '_src/assets/spriteicons/spritesheet.png',
				cssName: '_src/_prebuilt/sprites.scss',
				padding: 3,
				cssTemplate: path.join(ENDURO_FOLDER, 'support_files', 'sprite_generator.handlebars'),
				retinaSrcFilter: [path.join(CMD_FOLDER, 'assets/spriteicons/*@2x.png')],
				retinaImgName: '_src/assets/spriteicons/spritesheet@2x.png',
			}))
			.pipe(gulp.dest(CMD_FOLDER))

	})

	return sprite_icons_task_name
}

module.exports = new sprite_icons()
