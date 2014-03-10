function PluginManager () {
	this.plugins = {};
	this._chain = [this];
}

PluginManager.prototype.register = function (plugin) {
	this.plugins[plugin.name] = plugin;
	return this;
};

PluginManager.prototype.inherit = function (pluginManager) {
	this._chain.push(pluginManager);
	return this;
};

PluginManager.prototype.resolve = function (name) {
	var plugin = this.plugins[name];

	if (plugin) {
		return plugin;
	}
	
	//Search for plugin in the plugin chain
	for (var i = 1; i < this._chain.length; i += 1) {
		plugin = this._chain[i].resolve(name);

		if (plugin) {
			return plugin;
		}
	}

	return null;
};

module.exports = PluginManager;