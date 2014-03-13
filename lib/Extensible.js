var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var PluginManager = require('./PluginManager');
var PluginContext = require('./PluginContext');

function Extensible (pluginConfig) {
	EventEmitter.call(this);
	this.pluginConfig = pluginConfig || {};
	this.plugins = new PluginManager();
}

inherits(Extensible, EventEmitter);

Extensible.prototype.resolvePluginsFromConfigKeys = function () {
	var plugin;

	//Iterate through config keys, use them to resolve and run plugins
	for (var pluginName in this.pluginConfig) {
		plugin = this.plugins.resolve(pluginName);
		
		if (plugin) {
			this.plugin(plugin);
		}
	}

	return this;
};

//Runs a plugin against the extensible instance along with a context helper object.
Extensible.prototype.plugin = function (plugin) {
	var context = new PluginContext(this, plugin);
	plugin.call(this, context);
	return this;
};

Extensible.prototype.inheritConfig = function (inheritedConfig, shallow) {
	if (shallow === true) {
		_.defaults(this.pluginConfig, inheritedConfig);
	} else {
		defaultsDeep(this.pluginConfig, inheritedConfig);
	}

	return this;
};

function defaultsDeep (a, b) {
	for (var k in b) {
		if (typeof a[k] === 'object' && typeof b[k] === 'object') {
			defaultsDeep(a[k], b[k]);
		} else {
			a[k] = b[k];
		}
	}

	return a;
}

module.exports = Extensible;