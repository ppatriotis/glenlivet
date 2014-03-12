# Glenlivet

[![Build Status](https://travis-ci.org/prolificeric/glenlivet.png?branch=master)](https://travis-ci.org/prolificeric/glenlivet)
[![Coverage Status](https://coveralls.io/repos/prolificeric/glenlivet/badge.png)](https://coveralls.io/r/prolificeric/glenlivet)
[![Dependencies Status](https://david-dm.org/prolificeric/glenlivet.png)](https://david-dm.org/prolificeric/glenlivet.png)
[![Code Climate](https://codeclimate.com/github/prolificeric/glenlivet.png)](https://codeclimate.com/github/prolificeric/glenlivet)

Glenlivet is a hook and plugin system that allows you to create flexible, reusable processing workflows.

## Installation

	npm install glenlivet

## Overview

- Configure processing workflows declaratively with "bottles"
- Bundle bottles together using "barrels"
- Plugins automatically load based on configuration keys
- Use hooks to attach processing steps to bottles
- Add your own hooks to control processing flow
- Plugins are simple to create, and can be applied to barrels or bottles

## Philosophy

Glenlivet's job is to make it as easy as possible to write and implement plugins. Similar to [Grunt](https://github.com/gruntjs/grunt), but for writing apps.

## How It's Used

So far, it's been used to create the mobile API for the Threadless iPhone App that is mostly backed by scraped data from their website. Plugins are used to layer in user sessions, caching, and HTML to JSON payload mapping.

## Barrels and Bottles

Barrels create a logical grouping of bottles. Their purpose is to provide a way to create functionality on top of bottles. For example, you might want to create a web service that interfaces with a group of bottles.

### Basic Usage

```javascript
var glenlivet = require('glenlivet');

var myBarrel = glenlivet.createBarrel({});

var testBottle = myBarrel.createBottle('test', {
	fetch: { //Loads fetch plugin
		uri: 'http://www.prolificinteractive.com:page'
	}
});

testBottle.fetch({
	fetch: {
		page: '/about'
	}
}, function (err, result) {
	if (err) {
		console.log('Dammit, something broke.');
		return;
	}

	console.log(result.fetch.html);
});
```

## Plugins

Plugins typically attach processing steps via bottle hooks. They're loaded using they configuration keys on barrels and bottles.

### Creating a Plugin

Plugins are defined with named functions:

```javascript
function myPlugin (context) {
	context.is(glenlivet.Bottle, function (bottle, myConfig) {
		console.log('I am in a bottle');
	});

	context.is(glenlivet.Barrel, function (bottle, myConfig) {
		console.log('I am in a barrel');
	});
}
```

**Note: Plugins must be defined as named functions:**

```javascript
function correctWay () {}
var incorrectWay = function () {}
var thisWorksToo = function thisWorksToo () {}
```

#### Plugin Contexts

Plugins are passed a `context` object when they're called, which has several methods:

##### `context.is(constructor|constructors, callback)`

A single constructor or an array of constructors can be passed in as the first argument.

Tests if the plugin is currently called against an instance of the constructor, and runs the callback with two arguments:

- `instance`: An object the plugin is running against.
- `pluginConfig`: The config corresponding to the plugin.

##### `context.using(pluginName, callback)`

As a convenience, tests if another plugin is defined in the current context, and runs the callback if so with one argument:

- `otherPluginConfig`: The config corresponding to the other plugin.

### Registering a Plugin

You can register a plugin at multiple scopes: glenlivet, barrels, and bottles.

```javascript
glenlivet.plugins.register(myPlugin); //At the glenlivet scope
barrel.plugins.register(myPlugin); //At the barrel scope
bottle.plugins.register(myPlugin); //At the bottle scope
```

## Using Hooks

Hooks allow plugins to get along with each other by inserting themselves at different parts of the processing workflow. In Glenlivet, hooks are defined as hierarchies, often by plugins.

### Adding and Implementing Hooks

Hooks are added using `bottle.hooks.add(hierarchy)`, and implemented with three methods:

- `bottle.hooks.before(colonSeparatedPath, callback)`
- `bottle.hooks.when(colonSeparatedPath, callback)`
- `bottle.hooks.after(colonSeparatedPath, callback)`

The callback receives:

- `result`: The object that gets decorated by plugins to yield a result
- `next`: Used with asynchronous processes. Tells Glenlivet to advance to the next step.
- `done`: Completes this step and prevents the processing of any further hooks.

If the callback includes only one argument in its signature, it will be run synchronously.

#### Example

```javascript
function myPlugin (context) {
	context.is(glenlivet.Bottle, function (bottle, myConfig) {
		bottle.hooks.add({
			myPlugin: {
				setup: {}
			}
		});

		//Synchronous
		bottle.hooks.after('myPlugin:setup', function (result) {
			result.myPlugin.helloWorld = 'hello'
		});

		//Asynchronous
		bottle.hooks.when('myPlugin', function (result, next) {
			setTimeout(function () {
				result.myPlugin.helloWorld += 'world'
				next();
			}, 10);
		});

		//Using the done function
		bottle.hooks.before('myPlugin', function (result, next, done) {
			if (result.foo === 'bar') {
				done();
			}
		});
	});
}
```

### Triggering Hooks

Glenlivet adds convenience methods that trigger top-level hooks like so:

```javascript
function addition (context) {
	context.is(glenlivet.Bottle, function (bottle, myConfig) {
		bottle.hooks.add({
			addition: {}
		});

		bottle.hooks.when('addition', function (result) {
			result.addition.sum = result.addition.a + result.addition.b;
		});
	});
}

bottle.addition({
	addition: {
		a: 100,
		b: 50
	}
}, function (result) {
	console.log(result.addPlugin.sum); //Should output "150"
});
```
