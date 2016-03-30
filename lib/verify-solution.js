var fs = require('fs');
var path = require('path');
var verify = require('adventure-verify');
var sinon = require('sinon');
var jsdom = require('jsdom');

module.exports = function(opts) {
  return verify({ modeReset: true }, function (args, t) {
      var html = fs.readFileSync(opts.directory + '/index.html', 'utf-8');
      var doc = jsdom.jsdom(html, {
          virtualConsole: jsdom.createVirtualConsole().sendTo(console),
          features: {
              FetchExternalResources   : ['script'],
              ProcessExternalResources : ['script'],
              MutationEvents           : '2.0'
          }
      });
      var window = doc.defaultView;
      window.addEventListener("error", function (event) {
          console.error("script error!!", event.error);
      });
      jsdom.jQueryify(window, 'http://code.jquery.com/jquery-2.1.4.min.js', function () {
          var script = window.document.createElement('script');
          var before = opts.beforeSolution(doc, args, t);
          script.onload = function () {
              opts.solutionTest(doc, args, t, before);
          };
          script.src = path.resolve(args[0]);
          window.document.body.appendChild(script);
      });
  });
}
