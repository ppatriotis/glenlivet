var Glenlivet = require('../index');

describe('Glenlivet bottles', function () {
	it('should resolve plugins registered on the Glenlivet object', function () {
		Glenlivet.plugins.register(function testPlugin (context) {
			context.is(Glenlivet.Bottle, function (bottle, myConfig) {
				myConfig.x.should.equal(9999);
			});
		});

		Glenlivet.createBarrel({}).createBottle('testBottle', {
			testPlugin: {
				x: 9999
			}
		});
	});

	it('should resolve plugins registered on the parent Barrel object', function () {
		var barrel = Glenlivet.createBarrel({});

		barrel.plugins.register(function anotherPlugin (context) {
			context.is(Glenlivet.Bottle, function (bottle, myConfig) {
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
		var Bottle = Glenlivet.Bottle;

		Glenlivet.plugins.register(function myPlugin (context) {
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