
// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')
var path = require('path')
var request = require('request-promise')

// local dependencies
var local_enduro = require('../../index').quick_init()
var babel = require(enduro.enduro_path + '/libs/babel/babel')
var theme_manager = require(enduro.enduro_path + '/libs/theme_manager/theme_manager')

describe('[online_test] Theme manager server endpoints', function () {

	before(function () {
		enduro.actions.silent()
	})

	it('should fetch list of all themes', function () {
		return theme_manager.get_all_themes()
			.then((theme_list) => {
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

