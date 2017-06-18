'use strict'

var assert = require('assert')
var agent = require('supertest')
var Rill = require('rill')

describe('Rill/Document', function () {
  it('should work on the server', function (done) {
    var serverDocument = require('../server')
    var request = agent(
      Rill()
        .use(serverDocument
          .title('hi')
          .meta({ charset: 'utf8' })
        )
        .get('/', serverDocument.script({ src: 'index.js' }), function (ctx, next) {
          ctx.res.set('Content-Type', 'text/html; charset=UTF-8')
          ctx.res.body = '<div>Hello world</div>'
        })
        .listen()
    )

    request
      .get('/')
      .expect(200)
      .expect(function (res) {
        assert.equal(res.text, '<!DOCTYPE html><html><head><title>hi</title><meta charset="utf8"><script src="index.js"></script></head><body><div>Hello world</div></body>')
      })
      .expect('content-type', 'text/html; charset=UTF-8')
      .end(done)
  })

  it('should work on the browser', function (done) {
    var clientDocument = require('../client')
    var request = agent(
      Rill()
        .use(clientDocument
          .title('hi')
          .meta({ charset: 'utf8' })
        )
        .get('/', clientDocument.script({ src: 'index.js' }), function (ctx, next) {
          ctx.res.set('Content-Type', 'text/html; charset=UTF-8')
          ctx.res.body = '<div>Hello world</div>'
        })
        .listen()
    )

    request
      .get('/')
      .expect(200)
      .expect(function () {
        assert.equal(document.head.innerHTML, '<title>hi</title><meta charset="utf8"><script src="index.js"></script>')
      })
      .expect('content-type', 'text/html; charset=UTF-8')
      .end(done)
  })
})
