test:
	@node_modules/.bin/mocha --reporter spec --require should --growl

test-watch:
	@node_modules/.bin/mocha --reporter spec --require should --growl --watch

test-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov
	GLENLIVET_COV=1 node_modules/.bin/mocha --reporter html-cov --require should > coverage.html

test-coveralls:
	./node_modules/.bin/mocha test --reporter mocha-lcov-reporter --require should | ./node_modules/coveralls/bin/coveralls.js

.PHONY: all test