var HookManager = require('../index').HookManager;

describe('Adding hooks', function () {
	it('should run middleware with callback arguments asynchronously', function (done) {
		var hooks = new HookManager({
			foo: {}
		});

		hooks.when('foo', function (context, next) {
			context.z = 99;

			setTimeout(function () {
				context.z = 100;
				next();
			}, 10);
		});

		hooks.trigger('foo', {}, function (context) {
			context.z.should.equal(100);
			done();
		});
	});

	it('should allow middleware to bypass future middleware', function (done) {
		var hooks = new HookManager({
			foo: {}
		});

		hooks.before('foo', function (context, next, done) {
			context.x = 999;
			done();
		});

		hooks.after('foo', function (context, next, done) {
			context.x = null;
			next();
		});

		hooks.trigger('foo', {}, function (context) {
			context.x.should.equal(999);
			done();
		});
	});

	it('should run subhooks before running `when` and `after` hooks', function (done) {
		var hooks = new HookManager({
			foo: {
				bar: {},
				fizz: {}
			}
		});

		hooks.before('foo', function (context, next) {
			context.messages.push('before foo');
			next();
		});

		hooks.when('foo:bar', function (context, next) {
			context.messages.push('foo:bar');
			next();
		});

		hooks.when('foo:fizz', function (context, next) {
			context.messages.push('foo:fizz');
			next();
		});

		hooks.when('foo', function (context, next) {
			context.messages.push('foo');
			next();
		});

		hooks.after('foo', function (context, next) {
			context.messages.push('after foo');
			next();
		});

		hooks.trigger('foo', {
			messages: []
		}, function (context) {
			context.messages.join(', ').should.equal('before foo, foo:bar, foo:fizz, foo, after foo');
			done();
		});
	});

	it('should run middleware without only a context argument synchronously', function () {
		var hooks = new HookManager({
			foo: {}
		});

		hooks.when('foo', function (context) {
			context.x = 1;
		});

		hooks.trigger('foo', {}, function (context) {
			context.x.should.equal(1);
		});
	});
	
	it('should deep merge hook trees', function () {
		var hooks = new HookManager({
			foo: {
				fizz: {}
			}
		});

		hooks.add({
			foo: {
				fizz: {
					bar: {}
				}
			}
		});
		
		hooks.hookTree.hierarchy.foo.fizz.bar.should.be.an.Object;
	});
});