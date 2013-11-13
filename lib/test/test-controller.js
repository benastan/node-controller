(function() {
  var Controller, TestController;

  Controller = require('../');

  new Controller(TestController = (function() {
    function TestController() {}

    TestController["class"] = function() {
      return this.index = function(req, res) {
        return res.send(this.myVar);
      };
    };

    return TestController;

  })());

  module.exports = TestController;

}).call(this);
