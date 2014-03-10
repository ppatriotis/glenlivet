module.exports = process.env.GLENLIVET_COV
	? require('./lib-cov')
	: require('./lib');