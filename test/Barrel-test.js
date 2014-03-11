var glenlivet = require('../index');

describe('Glenlivet barrels', function () {
	it('should be able to create and associate a bottle', function () {
		var barrel = glenlivet.createBarrel({});
		barrel.createBottle('testBottle', {});
		barrel.createBottle('testBottle').should.be.an.instanceOf(glenlivet.Bottle);
	});

	it('should resolve plugins registered on the Glenlivet object', function () {
		glenlivet.plugins.register(function testPlugin (context) {
			context.is(glenlivet.Barrel, function (barrel, myConfig) {
				myConfig.foo.should.equal('bar');
			});
		});

		glenlivet.createBarrel({
			testPlugin: {
				foo: 'bar'
			}
		});
	});

	it('should emit a `bottle` event when a bottle is added to it', function (done) {
		var barrel = glenlivet.createBarrel({});

		barrel.on('bottle', function (bottle) {
			bottle.should.be.an.instanceOf(glenlivet.Bottle)
			done();
		});

		barrel.createBottle('myBottle', {});
	});
});