'use strict;'

var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var jsdom = require('jsdom');
var sinon = require('sinon');
var colorize = require('../colorize');
var directory = __dirname;

exports.problem = colorize(fs.readFileSync(directory + '/problem.txt', 'utf-8'));
exports.solution = colorize(fs.readFileSync(directory + '/solution.txt', 'utf-8'));

exports.verify = verify({ modeReset: true }, function (args, t) {
    var solution = fs.readFileSync(path.resolve(args[0]), 'utf-8');
    var html = fs.readFileSync(directory + '/index.html', 'utf-8');
    var doc = jsdom.jsdom(html, {
        features: {
            FetchExternalResources   : ['script'],
            ProcessExternalResources : ['script'],
            MutationEvents           : '2.0'
        }
    });
    var window = doc.defaultView;
    jsdom.jQueryify(window, 'http://code.jquery.com/jquery-2.1.4.min.js', function () {
        var spy = sinon.spy(window.$.fn, 'ready');

        var script = window.document.createElement('script');
        script.onload = function () {
            t.ok(spy.calledOnce);
            t.end();
        };
        script.text = solution;
        window.document.body.appendChild(script);
    });
});
