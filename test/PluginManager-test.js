var assert = require('assert');
var PluginManager = require('../index').PluginManager;

describe('Resolving plugins', function () {
	it('should return plugins by name', function () {
		var plugins = new PluginManager();
		function testPlugin () {}
		plugins.register(testPlugin).resolve('testPlugin').should.equal(testPlugin);
	});

	it('should return null for unresolve plugin names', function () {
		var plugins = new PluginManager();
		plugins.register(function testPlugin () {});
		assert.strictEqual(null, plugins.resolve('fooPlugin'));
	});

	it('should allow plugin inheritance', function () {
		var fooPlugins = new PluginManager();
		var barPlugins = new PluginManager();
		var fizzPlugins = new PluginManager();

		function foo () {}
		function bar () {}
		function fizz () {}

		fooPlugins.register(foo);
		barPlugins.register(bar);
		fizzPlugins.register(fizz);

		fooPlugins.inherit(barPlugins);
		barPlugins.inherit(fizzPlugins);

		fooPlugins.resolve('foo').should.equal(foo);
		assert.strictEqual(null, barPlugins.resolve('foo'));
		assert.strictEqual(null, fizzPlugins.resolve('foo'));

		fooPlugins.resolve('bar').should.equal(bar);
		barPlugins.resolve('bar').should.equal(bar);
		assert.strictEqual(null, fizzPlugins.resolve('bar'));

		fooPlugins.resolve('fizz').should.equal(fizz);
		barPlugins.resolve('fizz').should.equal(fizz);
		fizzPlugins.resolve('fizz').should.equal(fizz);
	});
});