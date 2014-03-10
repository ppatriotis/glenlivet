function fetch (context) {
	context.is(Glenlivet.Bottle, function (bottle, config) {
		console.log(config);
	});
};

require('../Glenlivet').plugins.register(fetch);