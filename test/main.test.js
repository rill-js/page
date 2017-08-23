'use strict'

var fs = require('fs')
var path = require('path')
var assert = require('assert')
var agent = require('supertest')
var Rill = require('rill')

describe('Rill/Document', function () {
  it('should work on the server', function (done) {
    var serverDocument = require('../server')
    var request = agent(
      Rill()
        .use(serverDocument
          .html({ lang: 'en' })
          .body({ class: 'page' })
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
        assert.equal(res.text, '<!DOCTYPE html><html lang="en"><head><title>hi</title><meta charset="utf8"><script src="index.js"></script></head><body class="page"><div>Hello world</div></body></html>')
      })
      .expect('content-type', 'text/html; charset=UTF-8')
      .end(done)
  })

  it('should accept streams on the server', function (done) {
    var serverDocument = require('../server')
    var request = agent(
      Rill()
        .use(serverDocument
          .title('hi')
          .meta({ charset: 'utf8' })
        )
        .get('/', serverDocument.script({ src: 'index.js' }), function (ctx, next) {
          ctx.res.set('Content-Type', 'text/html; charset=UTF-8')
          ctx.res.body = fs.createReadStream(path.join(__dirname, './example.html'))
        })
        .listen()
    )

    request
      .get('/')
      .expect(200)
      .expect(function (res) {
        assert.equal(res.text, '<!DOCTYPE html><html><head><title>hi</title><meta charset="utf8"><script src="index.js"></script></head><body><div>Some html</div>\n</body></html>')
      })
      .expect('content-type', 'text/html; charset=UTF-8')
      .end(done)
  })

  it('should work on the browser', function (done) {
    var clientDocument = require('../client')
    var request = agent(
      Rill()
        .use(clientDocument
          .html({ lang: 'en' })
          .body({ class: 'page' })
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
        assert.equal(document.documentElement.getAttribute('lang'), 'en')
        assert.equal(document.body.getAttribute('class'), 'page')
        assert.equal(document.head.innerHTML, '<title>hi</title><meta charset="utf8"><script src="index.js"></script>')
      })
      .expect('content-type', 'text/html; charset=UTF-8')
      .end(done)
  })
})
