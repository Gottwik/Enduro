var expect = require("chai").expect

var markdownifier = require(ENDURO_FOLDER + '/libs/markdown/markdownifier')

describe('Applying markdown to texts', function() {

	before(function(done) {
		markdownifier.init()
			.then(() => {
				done()
			})
	})

	it('should replace links with kispander anchors', function () {

		var test_input = {
			text: 'this is a [link]{linkurl}'
		}

		var expected_output = {
			text: 'this is a <a class="kispander-link" href="#ksp/linkurl">link</a>'
		}

		markdownifier.markdownify(test_input)

		expect(JSON.stringify(test_input)).to.equal(JSON.stringify(expected_output))
	})

})