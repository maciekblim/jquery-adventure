var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var jsdom = require('jsdom');
var sinon = require('sinon');
var directory = __dirname;

exports.problem = fs.createReadStream(directory + '/problem.txt');
exports.solution = fs.createReadStream(directory + '/solution.txt');

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
