'use strict;'

var fs = require('fs');
var path = require('path');
var colors = require('colors');

// var tag = /\{\{[\s]*([A-Za-z0-9_-]+)[\s]*(.*?)[\s]*\}\}([\s\S]*?)\{\{\/[\s]*\1[\s]*\}\}/;
var tag = /\{\{[\s]*([A-Za-z0-9_-]+)[\s]*\}\}([\s\S]*?)[\n|\n\r]?\{\{\/[\s]*\1[\s]*\}\}/;

var decorators = {
    code: function (text) {
        return colors.bgBlue.white(text);
    },
    h1: function (text) {
        return colors.bold.red(text);
    }
}

var interpolate = function (text) {
    var match = text.match(tag);
    if (match) {
        var decorator = decorators[RegExp.$1];
        var out = text;
        if (decorator) {
            out = text.replace(match[0], decorator(RegExp.$2));
        }
        return interpolate(out);
    }

    return text;
}

module.exports = interpolate;
