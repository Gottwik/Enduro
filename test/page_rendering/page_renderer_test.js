// vendor dependencies
var expect = require('chai').expect
var rewire = require('rewire')

// local dependencies
var local_enduro = require('../../index')
var page_renderer = require(enduro.enduro_path + '/libs/page_rendering/page_renderer')

// rewired dependencies
var internal_page_renderer = rewire(enduro.enduro_path + '/libs/page_rendering/page_renderer')

describe('page rendering', function () {

	// create a new project
	before(function (done) {
		return local_enduro.init()
			.then(() => {
				enduro.actions.silent()

				return local_enduro.run(['create', 'testproject_page_rendering'])
			})
			.then(() => {
				// navigate inside new project
				enduro.project_path = enduro.project_path + '/testproject_page_rendering'
				done()
			}, () => {
				done(new Error('Failed to create new project'))
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

	// navigate back to testfolder
	after(function () {
		enduro.project_path = process.cwd() + '/testfolder'
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
