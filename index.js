module.exports = process.env.GLENLIVET_COV
	? require('./lib-cov/Glenlivet')
	: require('./lib/Glenlivet');