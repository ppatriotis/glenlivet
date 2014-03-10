var assert = require('assert');
var HookTree = require('../index').HookTree;

describe('Describing hook hierarchy with a HookTree', function () {
    it('should be able to return a flattened list of keys', function () {
        var tree = new HookTree({
            foo: {
                bar: {
                    x: {}
                }
            },
            fizz: {}
        });

        tree.flattenKeys().join(', ').should.equal('foo, foo:bar, foo:bar:x, fizz');
    });

    it('should be able retrieve a subset of the tree by a string', function () {
        var tree = new HookTree({
            foo: {
                bar: {
                    x: {},
                    y: {}
                }
            }
        });

        tree.getSubtree('foo:bar').flattenKeys().join(', ').should.equal('x, y');
    });

    it('should return null when it can\'t resolve a subset of the tree by string', function () {
        var tree = new HookTree({
            foo: {}
        });

        assert.strictEqual(null, tree.getSubtree('you won\'t find me'));
    });
});