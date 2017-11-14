// * ———————————————————————————————————————————————————————— * //
// * 	remote handler
// *	uploads files to s3
// * ———————————————————————————————————————————————————————— * //
const filesystem = function () {}

// * vendor dependencies
const Promise = require('bluebird')
const s3 = require('s3')

// * enduro dependencies
const logger = require(enduro.enduro_path + '/libs/logger')

filesystem.prototype.init = function () {
	// no init required
}

filesystem.prototype.upload = function (filename, path_to_file) {
	const self = this

	return new Promise(function (resolve, reject) {

		const destination_url = self.get_remote_url(filename)

		const client = s3.createClient({
			s3Options: {
				accessKeyId: enduro.config.variables.S3_KEY,
				secretAccessKey: enduro.config.variables.S3_SECRET,
				region: enduro.config.s3.region || 'us-west-1',
			},
		})

		const params = {
			localFile: path_to_file,
			s3Params: {
				Bucket: enduro.config.s3.bucket,
				Key: filename,
				ACL: 'public-read',
			},
		}
		const uploader = client.uploadFile(params)

		uploader.on('error', function (err) {
			console.error('unable to upload:', err.stack)
		})

		uploader.on('end', function () {
			logger.timestamp('File uploaded successfully: ' + destination_url)
			return resolve(destination_url)
		})

	})
}

filesystem.prototype.get_remote_url = function (filename, juicebox) {
	if (enduro.config.s3.cloudfront && !juicebox) {
		return 'https://' + enduro.config.s3.cloudfront + '/' + filename
	} else if (enduro.config.s3.region === 'us-east-1') {
		return 'https://s3.amazonaws.com/' + enduro.config.s3.bucket + '/' + filename
	} else {
		return 'https://s3-' + (enduro.config.s3.region || 'us-west-1') + '.amazonaws.com/' + enduro.config.s3.bucket + '/' + filename
	}
}

module.exports = new filesystem()
