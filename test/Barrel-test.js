var Glenlivet = require('../index');

describe('Glenlivet barrels', function () {
	it('should be able to create and associate a bottle', function () {
		var barrel = Glenlivet.createBarrel({});
		barrel.createBottle('testBottle', {});
		barrel.createBottle('testBottle').should.be.an.instanceOf(Glenlivet.Bottle);
	});

	it('should resolve plugins registered on the Glenlivet object', function () {
		Glenlivet.plugins.register(function testPlugin (context) {
			context.is(Glenlivet.Barrel, function (barrel, myConfig) {
				myConfig.foo.should.equal('bar');
			});
		});

		Glenlivet.createBarrel({
			testPlugin: {
				foo: 'bar'
			}
		});
	});
});