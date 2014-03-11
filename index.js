if (process.env.GLENLIVET_COV) {
	require('blanket')({
        "pattern": "lib",
        "data-cover-never": "node_modules"
    });
}

module.exports = require('./lib');