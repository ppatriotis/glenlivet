var _ = require('lodash');

//Provides helpers for determining the context a plugin is running within.
function PluginContext (instance, plugin) {
	this.instance = instance;
	this.plugin = plugin;
}

//Determines if the plugin is running against a given extensible child class
PluginContext.prototype.is = function (classes, callback) {
	var matched = false;
	var pluginName;
	var pluginConfig;

	//Allow the passing of a single class or an array of classes
	if (!_.isArray(classes)) {
		classes = [classes];
	}

	for (var i = 0; i < classes.length; i += 1) {
		if (this.instance instanceof classes[i]) {
			matched = true;
			break;
		}
	}

	if (matched) {	
		pluginName = this.plugin.name || null;
		pluginConfig = (pluginName && this.instance.pluginConfig[pluginName]) || null;
		
		if (pluginConfig !== false) {
			callback.call(this.instance, this.instance, pluginConfig);
		}
	}

	return this;
};

//Determines if another plugin exists, allowing for combined functionality.
PluginContext.prototype.using = function (pluginName, callback) {
	var config = this.instance.pluginConfig[pluginName] || null;
	
	if (config) {
		callback.call(this.instance, config);
	}
	
	return this;
};

module.exports = PluginContext;