var expect = require('chai').expect

var local_enduro = require('../../index')
var format_service = require(enduro.enduro_path + '/libs/services/format_service')

describe('Format service', function () {

	it('should sluggify strings', function () {
		expect(format_service.slug('Project Name')).to.equal('project-name')
		expect(format_service.slug('Project Name!.?')).to.equal('project-name')
		expect(format_service.slug('    ProJect NaMe')).to.equal('project-name')
		expect(format_service.slug('!__ProJect NaMe__')).to.equal('__project-name__')
	})

	it('should enduro_sluggify strings', function () {
		expect(format_service.enduro_slug('Project Name')).to.equal('project_name')
		expect(format_service.enduro_slug('Project Name!.?')).to.equal('project_name')
		expect(format_service.enduro_slug('    ProJect NaMe')).to.equal('project_name')
		expect(format_service.enduro_slug('__ProJect NaMe__')).to.equal('project_name')
	})

	it('should prettify string', function () {
		expect(format_service.prettify_string('project_name')).to.equal('Project name')
		expect(format_service.prettify_string('project-name')).to.equal('Project name')
	})

})
