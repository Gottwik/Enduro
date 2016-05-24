// * ———————————————————————————————————————————————————————— * //
// * 	Enduro admin upload handler
// * ———————————————————————————————————————————————————————— * //
var admin_file_upload_handler = function () {}

// vendor dependencies
var Promise = require('bluebird')
var fs = require('fs')
var s3 = require('s3')
var moment = require('moment')

// local dependencies
var enduro_helpers = require(ENDURO_FOLDER + '/libs/flat_utilities/enduro_helpers')
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

// constants
var UPLOADS_FOLDER = '/assets/img/uploaded'
var S3_KEY = (global.config.secret && global.config.secret.s3 && global.config.secret.s3.S3_KEY) || process.env.S3_KEY
var S3_SECRET = (global.config.secret && global.config.secret.s3 && global.config.secret.s3.S3_SECRET) || process.env.S3_SECRET

admin_file_upload_handler.prototype.upload = function(file) {
	if(S3_KEY && S3_SECRET) {
		return uploadfile_s3(file)
	} else {
		return uploadfile_local(file)
	}
}


function uploadfile_local(file) {
	kiska_logger.timestamp('Uploading file to local storage','file_uploading')
	return new Promise(function(resolve, reject){
		var destination_path = CMD_FOLDER + UPLOADS_FOLDER + '/' + file.name
		var destination_src_path = CMD_FOLDER + '/_src/' +UPLOADS_FOLDER + file.name
		var destination_url = UPLOADS_FOLDER + '/' + file.name

		enduro_helpers.ensureDirectoryExistence(destination_src_path)
			.then(() => {
				var read_stream = fs.createReadStream(file.path)

				read_stream.pipe(fs.createWriteStream(destination_path))
				read_stream.pipe(fs.createWriteStream(destination_src_path))
					.on("close", function(err) {
						if(err) {
							console.log(err)
							return reject(err);
						}
						kiska_logger.timestamp('file was uploaded ' + destination_url,'file_uploading')
						resolve(destination_url)
					});
			})
	})
}

function uploadfile_s3(file) {
	kiska_logger.timestamp('Uploading file to s3','file_uploading')
	return new Promise(function(resolve, reject){

		var s3_bucket_name = global.config.s3.bucket
		var s3_region = global.config.s3.region || 'us-west-1'

		var s3_file_key = 'direct_uploads/' + file.name

		var destination_url = 'https://s3-' + s3_region + '.amazonaws.com/' + s3_bucket_name + '/' + s3_file_key

		var client = s3.createClient({
			s3Options: {
				accessKeyId: S3_KEY,
				secretAccessKey: S3_SECRET,
				region: "eu-west-1",
				//endpoint: 'cloudhsm.eu-central-1.amazonaws.com',
				// sslEnabled: false
				// any other options are passed to new AWS.S3()
				// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
			},
		})


		var params = {
				localFile: file.path,
				s3Params: {
					Bucket: s3_bucket_name,
					Key: s3_file_key,
					// other options supported by putObject, except Body and ContentLength.
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


module.exports = new admin_file_upload_handler()