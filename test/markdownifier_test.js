var expect = require('chai').expect

var local_enduro = require('../index').quick_init()
var markdownifier = require(enduro.enduro_path + '/libs/markdown/markdownifier')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')

describe('markdownifier', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'markdownifier_test', 'minimalistic')
			.then(() => {
				return enduro.actions.render()
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

	after(function () {
		return test_utilities.after()
	})

})
