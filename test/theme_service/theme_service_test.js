
// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')
var path = require('path')

// local dependencies
var enduro = require(ENDURO_FOLDER + '/index')
var babel = require(global.ENDURO_FOLDER + '/libs/babel/babel')
var request = require('request-promise')

var theme_manager = require(ENDURO_FOLDER + '/libs/theme_manager/theme_manager')

describe('Theme manager server endpoints', function () {

	before(function () {
		enduro.silent()
	})

	it('should fetch list of all themes', function () {
		return theme_manager.get_all_themes()
			.then((theme_list) => {
				theme_list = JSON.parse(theme_list)
				expect(theme_list).to.be.an('array')
			})
	})

	it('should fetch info for the \'mirror\' theme', function () {
		return theme_manager.fetch_theme_info_by_name('mirror', { stealth: true })
			.then((theme_info) => {
				expect(theme_info).to.be.an.object
				expect(theme_info.name).to.equal('mirror')
			})
	})

})

