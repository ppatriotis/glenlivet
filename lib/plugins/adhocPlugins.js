//Looks for an array of plugins stored as 'plugins', then runs each one against the instance
require('../Glenlivet').plugins.register(function plugins (context) {
    function runAdhocPlugins (instance) {
        _.each(instance.plugins, instance.plugin, instance);
    }

    context.is([Bottle, Barrel], runAdhocPlugins);
});