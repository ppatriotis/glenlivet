var _ = require('lodash');
var constants = require('./constants');
var HookTree = require('./HookTree');

function HookManager (hookHierarchy) {
	this.hookTree = new HookTree(hookHierarchy);
	this.hookStacks = {};
}

HookManager.prototype.add = function (namespace, additionHierarchy) {
	if (!additionHierarchy) {
		additionHierarchy = namespace;
		namespace = null;
	}

	var tree = (namespace && this.hookTree.getSubtree(namespace)) || this.hookTree;

	tree.merge(additionHierarchy);

	return this;
};

//Runs through middleware hooks starting with the one named by hook arg
HookManager.prototype.trigger = function (hook, decorator, callback) {
	var stack = this.getHookStack(hook);

	decorator = decorator || {};
	callback = callback || function () {};

	function next () {
		var middleware = stack.shift();

		if (middleware) {
			middleware.call(decorator, decorator, next, done);
			
			//For synchronous middleware
			if (middleware.length <= 1) {
				process.nextTick(next);
			}
		} else {
			callback(decorator);
		}
	}

	function done () {
		callback(decorator);
	}

	next();

	return this;
};

HookManager.prototype.join = function (hookA, hookB, map) {
	var hooks = this;

	map = map || {};

	this.after(hookA, function (decorator) {
		_.each(map, function (bPath, aPath) {
			deepAssign(decorator, bPath, getValueByPath(decorator, aPath));
		});

		hooks.trigger(hookB, decorator);
	});

	return this;
};

function getValueByPath (obj, path) {
	var parts = path.split('.');
	var value = obj;

	for (var i = 0, part; i < parts.length; i += 1) {
		part = parts[i];
		value = value[part];

		if (typeof value === 'undefined') {
			break;
		}
	}

	return value;
}

function deepAssign (obj, path, value) {
	var parts = path.split('.');
	var key = parts.pop();

	for (var i = 0, part; i < parts.length; i += 1) {
		part = parts[0];
		obj = obj[part] = typeof obj[part] === 'object'?  obj[part]: {};
	}

	obj[key] = value;

	return obj;
}

HookManager.prototype.getHookStack = function (hook, subtree) {
	var subtree = subtree || this.hookTree.getSubtree(hook);
	var stack = [];
	var before = this.hookStacks['before ' + hook] || [];
	var when = this.hookStacks[hook] || [];
	var after = this.hookStacks['after ' + hook] || [];

	stack = stack.concat(before);

	for (var subhook in subtree.hierarchy) {
		stack = stack.concat(this.getHookStack(hook + constants.HOOK_HIERARCHY_SEPARATOR + subhook, subtree.getSubtree[subhook]));
	}

	stack = stack.concat(when, after);

	return stack;
};

HookManager.prototype.when = function (hook, callback) {
	(this.hookStacks[hook] = this.hookStacks[hook] || []).push(callback);
	return this;
};

HookManager.prototype.before = function (hook, callback) {
	return this.when('before ' + hook, callback);
};

HookManager.prototype.after = function (hook, callback) {
	return this.when('after ' + hook, callback);
};

module.exports = HookManager;