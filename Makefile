test:
	@node_modules/.bin/mocha --reporter spec --require should --growl

test-watch:
	@node_modules/.bin/mocha --reporter spec --require should --growl --watch

coverage:
	@rm -rf lib-cov
	@jscoverage lib lib-cov
	GLENLIVET_COV=1 node_modules/.bin/mocha --reporter html-cov --require should > coverage.html

.PHONY: all test