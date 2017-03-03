var expect = require('chai').expect

var local_enduro = require('../index')
var markdownifier = require(enduro.enduro_path + '/libs/markdown/markdownifier')

describe('markdownifier', function () {

	before(function (done) {
		local_enduro.run(['create', 'markdownifier_test'])
			.then(() => {
				enduro.project_path = process.cwd() + '/testfolder/markdownifier_test'
				markdownifier.precompute()
					.then(() => {
						done()
					})
			}, (err) => {
				done(new Error(err))
			})
	})

	it('should replace links with kispander anchors', function () {

		var test_input = {
			text: 'this is a [link]{linkurl}'
		}

		var expected_output = {
			text: 'this is a <a class="kispander-link" href="#ksp/linkurl">link</a>'
		}

		return markdownifier.markdownify(test_input)
			.then((test_output) => {
				expect(JSON.stringify(test_output)).to.equal(JSON.stringify(expected_output))
			})

	})

})
