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
    beforeSolution: function(docElement, args, t, spy) {
        return sinon.spy(docElement.defaultView, '$');
    },
    solutionTest: function(docElement, args, t, spy) {
        t.ok(spy.calledOnce);
        t.end();
    }
});
