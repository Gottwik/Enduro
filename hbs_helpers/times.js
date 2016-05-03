// * ———————————————————————————————————————————————————————— * //
// *    Times helper
// *	Duplicates specified inner block specified times
// *	Usage:
// *
// *	{{#time 10}}
// *		<p>This is repeated 10 times</p>
// *	{{/times}}
// *
// * ———————————————————————————————————————————————————————— * //
__templating_engine.registerHelper('times', function(n, block) {
	var accum = ''

	for(var i = 0; i < n; ++i){
		accum += block.fn(this)
	}

	return accum
})