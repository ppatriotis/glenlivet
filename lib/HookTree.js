var constants = require('./constants');

function HookTree (hierarchy) {
	this.hierarchy = hierarchy || {};
}

//Turn a tree into an array of flattened keys
HookTree.prototype.flattenKeys = function () {
	return flattenHierarchy(this.hierarchy);
};

HookTree.prototype.merge = function (additionHierarchy) {
	var a = this.hierarchy;
	var b = additionHierarchy;

	mergeHierarchies(a, b);

	return this;
};

//Use a path to grab a part of a tree
HookTree.prototype.getSubtree = function (path, separator) {
	var separator = separator || constants.HOOK_HIERARCHY_SEPARATOR;
	var parts = path.split(separator);
	var sub = this.hierarchy;

	for (var i = 0; i < parts.length; i += 1) {
		sub = sub[parts[i]];

		if (!sub) {
			return null;
		}
	}

	return new HookTree(sub);
};

function flattenHierarchy (hierarchy, separator, parent) {
	var keys = [];
	var key;
	var separator = separator || constants.HOOK_HIERARCHY_SEPARATOR;

	for (var k in hierarchy) {
		key = parent? [parent, k].join(separator): k;
		keys.push(key);
		keys = keys.concat(flattenHierarchy(hierarchy[k], separator, key));
	}

	return keys;
}

function mergeHierarchies (a, b) {
	for (var k in b) {
		if (typeof a[k] === 'object' && typeof b[k] === 'object') {
			a[k] = mergeHierarchies(a[k], b[k]);
		} else if (k in a === false) {
			a[k] = b[k];
		}
	}

	return a;
}

module.exports = HookTree;