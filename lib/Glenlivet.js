var inherits = require('util').inherits;
var _ = require('lodash');
var HookManager = require('./HookManager');
var HookTree = require('./HookTree');
var PluginManager = require('./PluginManager');
var PluginContext = require('./PluginContext');
var Extensible = require('./Extensible');
var config = require('./constants');

var glenlivet = module.exports = {
    //Convenience methods
    createBarrel: function (pluginConfig) {
        return new Barrel(pluginConfig);
    },

    //Base level to store plugins at; inherited by Barrels and Bottles
    plugins: new PluginManager(),

    //Core classes
    Bottle: Bottle,
    Barrel: Barrel,
    Extensible: Extensible,
    HookManager: HookManager,
    HookTree: HookTree,
    PluginManager: PluginManager,
    PluginContext: PluginContext
};

function Bottle (pluginConfig, barrel) {
    Extensible.call(this, pluginConfig);

    this.hooks = new HookManager();

    //Inherit barrel configuration if possible
    if (barrel) {
        this.inheritConfig(barrel.pluginConfig);
        this.plugins.inherit(barrel.plugins);
    } else {
        this.plugins.inherit(glenlivet.plugins);
    }

    //Automatically load plugins based on the config passed in
    this.resolvePluginsFromConfigKeys();

    //Creates a method on the bottle and namespace on the result decorator for each top-level hook
    this._setupHookConveniences();
}

inherits(Bottle, Extensible);

Bottle.prototype._setupHookConveniences = function () {
    var bottle = this;

    _.each(this.hooks.hookTree.hierarchy, function (sub, hook) {
        //Add convenience method to each bottle implementing plugin
        bottle[hook] = bottle[hook] || function (decorator, callback) { //Do not override existing methods on bottle
            bottle.hooks.trigger(hook, decorator, callback);
        };

        //Add namespace to result decorator
        bottle.hooks.before(hook, function (decorator) {
            decorator[hook] = decorator[hook] || {}; //Do not override existing namespace
        });
    });

    return this;
};

Bottle.prototype._addResultNamespaces = function () {
    var bottle = this;

    _.each(this.hooks.hookTree.hierarchy, function (sub, hook) {
        bottle.hooks.before(hook, function (result) {
            result[hook] = {};
        });
    });

    return this;
};

//A container for bottles to add high-level functionality to
function Barrel (pluginConfig) {
    Extensible.call(this, pluginConfig);

    this.bottles = {};

    //Inherit plugins from Glenlivet
    this.plugins.inherit(glenlivet.plugins);

    //Automatically load plugins based on the config passed in
    this.resolvePluginsFromConfigKeys();
}

inherits(Barrel, Extensible);

Barrel.prototype.createBottle = function (name, pluginConfig) {
    if (!pluginConfig) return this.bottles[name];
    return this.bottles[name] = new Bottle(pluginConfig, this);
};