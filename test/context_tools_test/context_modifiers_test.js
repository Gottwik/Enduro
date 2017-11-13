// * vendor dependencies
const expect = require('chai').expect

// * enduro dependencies
const local_enduro = require('../../index')
const context_modifiers = require(enduro.enduro_path + '/libs/context_tools/context_modifiers')

describe('context modifiers', function () {

	it('should add sibling to type', function () {
		const input = {
			$val_type: 'supertype',
			val: 'abc',
		}

		const expected_output = {
			$val_crap_crap: 'added this',
			$val_type: 'supertype',
			val: 'abc',
		}

		const modified_input = context_modifiers.add_sibling_to_type(input, 'supertype', 'crap_crap', 'added this')

		expect(modified_input).to.deep.equal(expected_output)
	})

	it('should add sibling to deeply nestedtype', function () {
		const input = {
			deep: {
				$val_type: 'supertype',
				val: 'abc',
			}
		}

		const expected_output = {
			deep: {
				$val_crap_crap: 'added this',
				$val_type: 'supertype',
				val: 'abc',
			}
		}

		const modified_input = context_modifiers.add_sibling_to_type(input, 'supertype', 'crap_crap', 'added this')

		expect(modified_input).to.deep.equal(expected_output)
	})

})