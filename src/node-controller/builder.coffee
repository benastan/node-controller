module.exports = class Builder
  constructor: ({ @builder, @controller, @handler }) ->
    @builder.apply(@)
    for method, value of this
      switch method
        when 'builder', 'controller', 'handler' then continue
      @defineAction(method, value) if @hasOwnProperty(method)
  addFilter: (type, callback) ->
    filters = @handler.filters[type] ||= []
    filters.push(callback)
  before: (callback) -> @addFilter('before', callback)
  after: (callback) -> @addFilter('after', callback)
  around: (callback) -> @addFilter('around', callback)
  defineAction: (actionName, callback) ->
    @controller[actionName] = @handler.performAction(actionName, callback)
