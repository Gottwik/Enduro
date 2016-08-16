var expect = require('chai').expect

var babel = require(global.ENDURO_FOLDER + '/libs/babel/babel')
var enduro = require(ENDURO_FOLDER + '/index')
var pagelist_generator = require(ENDURO_FOLDER + '/libs/build_tools/pagelist_generator')

describe('Page list generation', function() {

	before(function(done) {
		enduro.run(['create', 'pagelist_generator_test', 'test'])
			.then(() => {
				CMD_FOLDER = process.cwd() + '/testfolder/pagelist_generator_test'
				done()
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should generate cmslist successfully', function (done) {
		pagelist_generator.generate_cms_list()
			.then((cmslist) => {
				console.log(cmslist)
				done()
			})
	})

	// navigate back to testfolder
	after(function(){
		global.CMD_FOLDER = process.cwd() + '/testfolder'
	})

})


