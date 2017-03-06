#!/usr/bin/env node

global.program = require('yargs')
	.options({
		'force': {
			alias: 'f',
			describe: 'force',
			global: true,
		},
		'norefresh': {
			alias: 'n',
			describe: 'norefresh',
			global: true,
		},
	})
	.commandDir('cli_commands')
	.version(require('./package.json').version)
	.help()
	.alias('help', 'h')
	.wrap(120)
	.argv

// #!/usr/bin/env node

// global.enduro = {}

// enduro.program = require('commander');

// // var enduro_instance = require('./index')




// enduro.program
// 	.version(require('./package.json').version)
// 	.option('-f, --force', 'Enables force flag')

// enduro.program
// 	.command('dev')
// 	.description('start enduro in development mode')
// 	.action(function(env, options){
// 		console.log(enduro.program)
// 		// enduro_instance.init()
// 		// 	.then(() => {
// 		// enduro.actions.developer_start()
// 	})



// // program
// //   .command('exec <cmd>')
// //   .alias('ex')
// //   .description('execute the given remote cmd')
// //   .option("-e, --exec_mode <mode>", "Which exec mode to use")
// //   .action(function(cmd, options){
// //     console.log('exec "%s" using %s mode', cmd, options.exec_mode);
// //   }).on('--help', function() {
// //     console.log('  Examples:');
// //     console.log();
// //     console.log('    $ deploy exec sequential');
// //     console.log('    $ deploy exec async');
// //     console.log();
// //   });

// // program
// //   .command('*')
// //   .action(function(env){
// //     console.log('deploying "%s"', env);
// //   });

// enduro.program.parse(process.argv);
// 	// })

// // #!/usr/bin/env node

// // // Stores all arguments without node and without enduro
// // var all_args = process.argv.slice(2)

// // // stores arguments
// // var args = []

// // // stores flags
// // var flags = []

// // // helper variables
// // // var arg
// // // var base

// // // removes enduro path and keeps the arguments
// // // do arg = args.shift();
// // // while ( fs.realpathSync(arg) !== __filename
// // // 	&& !(base = path.basename(arg)).match(/^enduro$|^enduro.js$|^enduro$/)
// // // )

// // for (i in all_args) {

// // 	// check if argument is a flag or not
// // 	all_args[i][0] != '-'
// // 		? args.push(all_args[i])
// // 		: flags.push(all_args[i].slice(1))
// // }

// // // runs index.js file with defined arguments
// // require('./index').run(args, flags)
