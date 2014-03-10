var assert = require('assert');
var Extensible = require('../index').Extensible;

describe('Extending objects with plugins', function () {
	it('should inherit config with deep algorithm by default', function () {
		var ext = new Extensible({
			foo: {
				bar: {
					x: 1
				}
			}
		});

		ext.inheritConfig({
			foo: {
				bar: {},
				fizz: {
					y: 2
				}
			}
		});

		ext.pluginConfig.foo.bar.x.should.equal(1);
		ext.pluginConfig.foo.fizz.y.should.equal(2);
	});

	it('should inherit config with shallow algorithm if specified', function () {
		var ext = new Extensible({
			foo: {
				bar: {
					x: 1
				}
			}
		});

		ext.inheritConfig({
			foo: false
		}, true);

		ext.pluginConfig.foo.bar.x.should.equal(1);
	});
});