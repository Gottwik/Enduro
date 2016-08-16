// * ———————————————————————————————————————————————————————— * //
// * 	remote handler
// *	uploads files to s3
// * ———————————————————————————————————————————————————————— * //
var remote_handler = function () {};

// vendor dependencies
var Promise = require('bluebird')
var s3 = require('s3')

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')


remote_handler.prototype.upload_to_s3_by_file = function (file, timestamp) {
	var filename = timestamp ? timestamp_filename(file.name) : file.name
	return s3_upload('direct_uploads/' + filename, file.path)
}

remote_handler.prototype.upload_to_s3_by_filepath = function (filename, filepath) {
	return s3_upload(filename, filepath)
}

remote_handler.prototype.get_remote_url = function (filename) {
	return get_remote_url(filename)
}

function timestamp_filename(filename) {
	return (new Date/1e3|0) + '_' + filename
}

function s3_upload(filename, filepath) {
	//kiska_logger.timestamp('Uploading file to s3','file_uploading')
	return new Promise(function(resolve, reject) {

		var destination_url = get_remote_url(filename)

		var client = s3.createClient({
			s3Options: {
				accessKeyId: global.config.variables.S3_KEY,
				secretAccessKey: global.config.variables.S3_SECRET,
				region: global.config.s3.region || 'us-west-1',
				//endpoint: 'cloudhsm.eu-central-1.amazonaws.com',
				// sslEnabled: false
				// any other options are passed to new AWS.S3()
				// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
			},
		})

		var params = {
			localFile: filepath,
			s3Params: {
				Bucket: global.config.s3.bucket,
				Key: filename,
				// other options suwpported by putObject, except Body and ContentLength.
				// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
			},
		};
		var uploader = client.uploadFile(params);

		uploader.on('error', function(err) {
			console.error("unable to upload:", err.stack);
		});

		uploader.on('progress', function() {
			//console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
		});

		uploader.on('end', function() {
			kiska_logger.timestamp('File uploaded successfully: ' + destination_url)
			return resolve(destination_url)
		});

	})
}

function get_remote_url(filename) {
	return 'https://s3-' + (global.config.s3.region || 'us-west-1') + '.amazonaws.com/' + global.config.s3.bucket + '/' + filename
}

module.exports = new remote_handler()