(function() {
  var Builder;

  module.exports = Builder = (function() {
    function Builder(_arg) {
      var method, value;
      this.builder = _arg.builder, this.controller = _arg.controller, this.handler = _arg.handler;
      this.builder.apply(this);
      for (method in this) {
        value = this[method];
        switch (method) {
          case 'builder':
          case 'controller':
          case 'handler':
            continue;
        }
        if (this.hasOwnProperty(method)) {
          this.defineAction(method, value);
        }
      }
    }

    Builder.prototype.addFilter = function(type, callback) {
      var filters, _base;
      filters = (_base = this.handler.filters)[type] || (_base[type] = []);
      return filters.push(callback);
    };

    Builder.prototype.before = function(callback) {
      return this.addFilter('before', callback);
    };

    Builder.prototype.after = function(callback) {
      return this.addFilter('after', callback);
    };

    Builder.prototype.around = function(callback) {
      return this.addFilter('around', callback);
    };

    Builder.prototype.defineAction = function(actionName, callback) {
      return this.controller[actionName] = this.handler.performAction(actionName, callback);
    };

    return Builder;

  })();

}).call(this);
