'use strict;'

var directory = __dirname;
var colorize = require('../../lib/colorize');
var fs = require('fs');
var sinon = require('sinon');
var verifySolution = require('../../lib/verify-solution');

exports.problem = colorize(fs.readFileSync(directory + '/problem.txt', 'utf-8'));
exports.solution = colorize(fs.readFileSync(directory + '/solution.txt', 'utf-8'));

exports.verify = verifySolution({
    directory: directory,
    beforeSolution: function(docElement, args, t) {
        var $ = docElement.defaultView.$;

        // Prepare random name attribute for nodes
        $('.blog-comment').attr('name', function(index) {
            return 'blog-comment-' + Date.now();
        });

        return {
            css: sinon.spy($.fn, 'css'),
            html: sinon.spy($.fn, 'html'),
            attr: sinon.spy($.fn, 'attr')
        }
    },
    solutionTest: function(docElement, args, t, spies) {
        var $ = docElement.defaultView.$;
        // Check for proper function calls
        t.ok(spies.css.calledOnce, 'css method called once');
        t.ok(spies.html.calledOnce, 'html method called once');
        t.equal(spies.attr.callCount, $('.blog-comment').length, 'attr called for each .blog-comment');

        // Check css function result
        var cssPass = true;
        $('.blog-post').each(function(index, element) {
            if($(element).css('color') !== 'red') cssPass = false;
        });
        t.ok(cssPass, 'color "red" for every .blog-post');

        // Check inserting text result
        var textPass = true;
        $('.blog-comment').each(function(index, element) {
            if($(element).text() !== $(element).attr('name')) textPass = false;
        });
        t.ok(textPass, 'text copied from attr name for every .blog-comment');

        t.end();
    }
});
