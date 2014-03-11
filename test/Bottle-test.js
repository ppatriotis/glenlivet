var glenlivet = require('../index');

describe('Glenlivet bottles', function () {
	it('should resolve plugins registered on the Glenlivet object', function () {
		glenlivet.plugins.register(function testPlugin (context) {
			context.is(glenlivet.Bottle, function (bottle, myConfig) {
				myConfig.x.should.equal(9999);
			});
		});

		glenlivet.createBarrel({}).createBottle('testBottle', {
			testPlugin: {
				x: 9999
			}
		});
	});

	it('should create helper methods for each top-level hook', function (done) {
		var barrel = glenlivet.createBarrel();

		barrel.plugins.register(function testPlugin (context) {
			context.is(glenlivet.Bottle, function (bottle, myConfig) {
				bottle.hooks.add({
					testPlugin: {}
				});

				bottle.hooks.after('testPlugin', function () {
					done();
				});
			});
		});

		var testBottle = barrel.createBottle('testBottle', {
			testPlugin: {}
		});

		testBottle.testPlugin({
			foo: ''
		}, function () {});
	});

	it('should create a namespace on hook result objects for each top-level hook', function (done) {
		var barrel = glenlivet.createBarrel();

		barrel.plugins.register(function testPlugin (context) {
			context.is(glenlivet.Bottle, function (bottle, myConfig) {
				bottle.hooks.add({
					testPlugin: {}
				});

				bottle.hooks.after('testPlugin', function (result) {
					result.testPlugin.foo = 'bar'; //Expects testPlugin to be there
				});
			});
		});

		var testBottle = barrel.createBottle('testBottle', {
			testPlugin: {}
		});

		testBottle.testPlugin({
			testPlugin: {
				foo: ''
			}
		}, function (result) {
			result.testPlugin.foo.should.equal('bar');
			done();
		});
	});

	it('should create a namespace on hook result objects but not override existing ones', function (done) {
		var barrel = glenlivet.createBarrel();

		barrel.plugins.register(function testPlugin (context) {
			context.is(glenlivet.Bottle, function (bottle, myConfig) {
				bottle.hooks.add({
					testPlugin: {}
				});
			});
		});

		var testBottle = barrel.createBottle('testBottle', {
			testPlugin: {}
		});

		testBottle.testPlugin({
			testPlugin: {
				foo: '',
				x: 1
			}
		}, function (result) {
			result.testPlugin.x.should.equal(1);
			done();
		});
	});

	it('should resolve plugins registered on the parent Barrel object', function () {
		var barrel = glenlivet.createBarrel({});

		barrel.plugins.register(function anotherPlugin (context) {
			context.is(glenlivet.Bottle, function (bottle, myConfig) {
				myConfig.y.should.equal(100);
			});
		});

		barrel.createBottle('testBottle', {
			anotherPlugin: {
				y: 100
			}
		});
	});

	it('should inherit straight from Glenlivet plugins if not a child of a barrel', function () {
		var Bottle = glenlivet.Bottle;

		glenlivet.plugins.register(function myPlugin (context) {
			context.is(Bottle, function (bottle, myConfig) {
				myConfig.z.should.equal('ABC');
			});
		});

		new Bottle({
			myPlugin: {
				z: 'ABC'
			}
		});
	});
});