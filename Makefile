test:
	@node_modules/.bin/mocha --reporter spec --require should --growl

test-watch:
	@node_modules/.bin/mocha --reporter spec --require should --growl --watch

test-cov: generate-cov
	@GLENLIVET_COV=1 node_modules/.bin/mocha --reporter html-cov --require should > coverage.html

test-coveralls: generate-cov
	@cd lib-cov; GLENLIVET_COV=1 ../node_modules/.bin/mocha ../test --reporter mocha-lcov-reporter --require should | ../node_modules/.bin/coveralls

generate-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov

.PHONY: all test