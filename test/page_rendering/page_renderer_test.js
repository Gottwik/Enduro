// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')

// local dependencies
var local_enduro = require('../../index').quick_init()
var page_renderer = require(enduro.enduro_path + '/libs/page_rendering/page_renderer')
var test_utilities = require(enduro.enduro_path + '/test/libs/test_utilities')


// rewired dependencies
var internal_page_renderer = rewire(enduro.enduro_path + '/libs/page_rendering/page_renderer')

describe('page rendering', function () {

	before(function () {
		return test_utilities.before(local_enduro, 'testproject_page_rendering', 'minimalistic')
			.then(() => {
				return enduro.actions.render()
			})
	})

	it('should render a page based on page name', function () {
		return page_renderer.render_file_by_template_path_extend_context('index')
			.then((output) => {
				expect(output).to.contain('head')
				expect(output).to.contain('body')
				expect(output).to.not.contain('{{>end}}')
			})
	})

	it('should render a page based on page name with extended context', function () {
		return page_renderer.render_file_by_template_path_extend_context('index', {greeting: 'whatup'})
			.then((output) => {
				expect(output).to.contain('whatup')
			})
	})

	after(function () {
		return test_utilities.after()
	})

})

describe('path handling by page renderer', function () {

	it('should convert relative filename to absolute path', function () {
		var generated_path = internal_page_renderer.__get__('get_absolute_template_path_by_context_path')('index')
		expect(generated_path.toLowerCase()).to.contain('index.hbs')
		expect(generated_path.toLowerCase()).to.contain('pages')
		expect(generated_path.toLowerCase()).to.contain('enduro')
	})

	it('should convert relative filename to absolute path even if it is prepended by /', function () {
		var generated_path = internal_page_renderer.__get__('get_absolute_template_path_by_context_path')('/index')
		expect(generated_path.toLowerCase()).to.contain('index.hbs')
		expect(generated_path.toLowerCase()).to.contain('pages')
		expect(generated_path.toLowerCase()).to.contain('enduro')
	})

	it('should convert relative generator filename to absolute path', function () {
		var generated_path = internal_page_renderer.__get__('get_absolute_template_path_by_context_path')('generators/docs/kitchen')
		expect(generated_path.toLowerCase()).to.contain('docs.hbs')
		expect(generated_path.toLowerCase()).to.contain('pages')
		expect(generated_path.toLowerCase()).to.contain('enduro')
	})

})
