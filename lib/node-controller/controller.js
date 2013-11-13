(function() {
  var Builder, Controller, controllers,
    __slice = [].slice;

  Builder = require('./builder');

  controllers = {};

  Controller = (function() {
    function Controller(controller) {
      this.controller = controller;
      this.controller.controller = this;
      this.name = this.controller.name.split('').slice(0, -10).join('').toLowerCase();
      controllers[this.name] = this;
      this.filters = {};
      this.actions = {};
      this.builder = new Builder({
        controller: this.controller,
        handler: this,
        builder: controller["class"]
      });
    }

    Controller.prototype.performAroundFilters = function() {
      var args, callbacks, controller, filters, i, ii, next, perform;
      perform = arguments[0], controller = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      filters = this.getFilters('around');
      if (!filters) {
        return perform();
      }
      i = 0;
      ii = filters.length;
      callbacks = [];
      return (next = function() {
        var callback, nextFilter;
        callback = arguments[0];
        if (typeof callback === 'function') {
          callbacks.push(callback);
        }
        nextFilter = filters[i];
        i += 1;
        if (i > ii) {
          perform();
          return callbacks.forEach(function(callback) {
            return callback.apply(controller, args);
          });
        } else {
          args.unshift(next);
          return nextFilter.apply(controller, args);
        }
      })();
    };

    Controller.prototype.performBeforeFilters = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.performFilters.apply(this, ['before'].concat(__slice.call(args)));
    };

    Controller.prototype.performAfterFilters = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.performFilters.apply(this, ['after'].concat(__slice.call(args)));
    };

    Controller.prototype.performFilters = function() {
      var args, controller, filters, type;
      type = arguments[0], controller = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      filters = this.getFilters(type);
      if (!filters) {
        return;
      }
      return filters.forEach(function(filter) {
        return filter.apply(controller, args);
      });
    };

    Controller.prototype.performAction = function(actionName, actionCallback) {
      var _this = this;
      return function() {
        var otherArgs, perform, req, res;
        req = arguments[0], res = arguments[1], otherArgs = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        req.controller = _this;
        req.action = actionName;
        perform = function() {
          return actionCallback.apply(null, [req, res].concat(__slice.call(otherArgs)));
        };
        _this.performBeforeFilters(_this.controller, req, res);
        _this.performAroundFilters(perform, _this.controller, req, res);
        return _this.performAfterFilters(_this.controller, req, res);
      };
    };

    Controller.prototype.getFilters = function(type) {
      var filters;
      filters = this.filters[type];
      try {
        filters = Controller.__super__.getFilters.call(this, type).concat(filters);
      } catch (_error) {}
      return filters;
    };

    return Controller;

  })();

  module.exports = Controller;

}).call(this);
