var inherits = require('util').inherits;
var _ = require('lodash');
var HookManager = require('./HookManager');
var HookTree = require('./HookTree');
var PluginManager = require('./PluginManager');
var PluginContext = require('./PluginContext');
var Extensible = require('./Extensible');
var config = require('./constants');

var Glenlivet = module.exports = {
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
        this.plugins.inherit(Glenlivet.plugins);
    }

    //Automatically load plugins based on the config passed in
    this.resolvePluginsFromConfigKeys();
}

inherits(Bottle, Extensible);

//A container for bottles to add high-level functionality to
function Barrel (pluginConfig) {
    Extensible.call(this, pluginConfig);

    this.bottles = {};

    //Inherit plugins from Glenlivet
    this.plugins.inherit(Glenlivet.plugins);

    //Automatically load plugins based on the config passed in
    this.resolvePluginsFromConfigKeys();
}

inherits(Barrel, Extensible);

Barrel.prototype.createBottle = function (name, pluginConfig) {
    if (!pluginConfig) return this.bottles[name];
    return this.bottles[name] = new Bottle(pluginConfig, this);
};