var PluginContext = require('../index').PluginContext;

describe('Running plugins within a context', function () {
	it('should be able to match context type by constructor function', function () {
		var instance = new Class();
		var context = new PluginContext(instance, xPlugin);

		xPlugin.call(instance, context);

		function Class () {
			this.pluginConfig = {
				xPlugin: {
					x: 5
				}
			};
		}

		function xPlugin (context) {
			context.is(Class, function (instance, xConfig) {
				xConfig.x.should.equal(5);
			});
		}
	});

	it('should be able to match context type by constructor name', function () {
		var instance = new Class();
		var context = new PluginContext(instance, xPlugin);

		xPlugin.call(instance, context);
		
		function Class () {
			this.pluginConfig = {
				xPlugin: {
					x: 5
				}
			};
		}

		function xPlugin (context) {
			context.is('Class', function (instance, xConfig) {
				xConfig.x.should.equal(5);
			});
		}
	});

	it('should be able to combine with other plugins in that context', function () {
		function Class () {
			this.pluginConfig = {
				xPlugin: {
					x: 5
				},
				yPlugin: {
					y: 10
				}
			};
		}

		function xPlugin (context) {
			context.using('yPlugin', function (yConfig) {
				yConfig.y.should.equal(10);
			});
		}

		var instance = new Class();
		var context = new PluginContext(instance, xPlugin);

		xPlugin.call(instance, context);
	});
});