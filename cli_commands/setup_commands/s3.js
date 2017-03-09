// global dependencies
var inquirer = require('inquirer')

// local dependencies
var enduro_instance = require('../../index').quick_init()
var enduro_configurator = require(enduro.enduro_path + '/libs/configuration/enduro_configurator')
var logger = require(enduro.enduro_path + '/libs/logger')

module.exports = {
	command: 's3',
	desc: 'sets up aws s3 as enduro.js filesystem',
	builder: (yargs) => {
		return yargs
			.usage('enduro juice s3')
	},
	handler: function (cli_arguments) {
		logger.init('setting up s3')

		return inquirer.prompt([
			{
				name: 'secret.s3.S3_KEY',
				message: 'Input your s3 key',
				type: 'password',
			},
			{
				name: 'secret.s3.S3_SECRET',
				message: 'Input your s3 secret key',
				type: 'password',
			},
			{
				name: 's3.bucket',
				message: 'What is the s3 bucket name?',
				type: 'input',
			},
			{
				name: 's3.region',
				message: 'select s3 region',
				type: 'list',
				default: 'eu-west-1',
				choices: [
					'us-east-1',
					'us-east-2',
					'us-west-1',
					'us-west-2',
					'ap-northeast-2',
					'ap-southeast-1',
					'ap-southeast-2',
					'ap-northeast-1',
					'eu-west-1',
					'eu-west-2'
				],
			},
			{
				name: 'juicebox_enabled',
				message: 'Enable juicebox',
				type: 'confirm',
				default: false,
			},
		])
		.then((answers) => {
			return enduro_configurator.set_config(answers)
		})
		.then(() => {
			logger.line()
			logger.log('s3 set successfully')
			logger.end()
		})
	}
}
