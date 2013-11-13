Controller = require '../'

new Controller class TestController
  @class: ->
    @index = (req, res) ->
      res.send(@myVar)

module.exports = TestController
