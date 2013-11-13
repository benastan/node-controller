chai = require 'chai'
chai.should()
express = require 'express'
app = express()
request = require 'supertest'
Controller = require './lib'
TestController = require './lib/test/test-controller'
class ChildTestController extends TestController

describe 'ChildTestController', ->
  app = false

  beforeEach ->
    app = express()
    app.get('/', ChildTestController.index)

  it 'adds properties to the controller', ->
    ChildTestController.controller.name.should.eq('test')
    ChildTestController.controller.should.be.an.instanceOf(Controller)

  describe 'filters', ->

    describe 'before', ->
      beforeOccurred = false
      beforeEach ->
        beforeOccurred = false
        ChildTestController.controller.filters.before = [
          -> beforeOccurred = true
        ]
      afterEach ->
        delete ChildTestController.controller.filters.before
      it 'performs before filter', (done) ->
        request(app).get('/').expect(200).end ->
          beforeOccurred.should.eq(true)
          done()

    describe 'after', ->
      afterOccurred = false
      beforeEach ->
        afterOccurred = false
        ChildTestController.controller.filters.after = [
          -> afterOccurred = true
        ]
      afterEach ->
        delete ChildTestController.controller.filters.after
      it 'performs after filter', (done) ->
        request(app).get('/').expect(200).end ->
          afterOccurred.should.eq(true)
          done()

    describe 'around', ->
      beforeAroundOccurred = false
      afterAroundOccured = false
      beforeEach ->
        beforeAroundOccurred = false
        afterAroundOccured = false
        ChildTestController.controller.filters.around = [
          (next) ->
            beforeAroundOccurred = true
            next -> afterAroundOccured = true
        ]
      afterEach ->
        delete ChildTestController.controller.filters.around

      it 'performs around filter', (done) ->
        request(app).get('/').expect(200).end ->
          beforeAroundOccurred.should.eq(true)
          done()

      it 'performs around filter callback', (done) ->
        request(app).get('/').expect(200).end ->
          afterAroundOccured.should.eq(true)
          done()
