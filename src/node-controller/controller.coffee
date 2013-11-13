Builder = require './builder'
controllers = {}

class Controller
  constructor: (@controller) ->
    @controller.controller = this
    @name = @controller.name.split('').slice(0, -10).join('').toLowerCase()
    controllers[@name] = @
    @filters = {}
    @actions = {}
    @builder = new Builder
      controller: @controller
      handler: this
      builder: controller.class

  performAroundFilters: (perform, controller, args...) ->
    filters = @getFilters('around')
    return perform() unless filters
    i = 0
    ii = filters.length
    callbacks = []
    do next = ->
      callback = arguments[0]
      callbacks.push(callback) if typeof callback is 'function'
      nextFilter = filters[i]
      i += 1
      if i > ii
        perform()
        callbacks.forEach (callback) -> callback.apply(controller, args)
      else
        args.unshift(next)
        nextFilter.apply(controller, args)
  performBeforeFilters: (args...) -> @performFilters('before', args...)
  performAfterFilters: (args...) -> @performFilters('after', args...)
  performFilters: (type, controller, args...) ->
    filters = @getFilters(type)
    return unless filters
    filters.forEach (filter) -> filter.apply(controller, args)
  performAction: (actionName, actionCallback) ->
    (req, res, otherArgs...) =>
      req.controller = this
      req.action = actionName
      perform = -> actionCallback(req, res, otherArgs...)
      @performBeforeFilters(@controller, req, res)
      @performAroundFilters(perform, @controller, req, res)
      @performAfterFilters(@controller, req, res)

  getFilters: (type) ->
    filters = @filters[type]
    try
      filters = super(type).concat(filters)
    filters

module.exports = Controller
