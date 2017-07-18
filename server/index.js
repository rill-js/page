'use strict'

var Head = require('set-head')
var combinedStream = require('combined-stream2')

// Add middleware for each type of tag.
Head.TAGS.forEach(function (tag) {
  exports[tag] = function (attrs) {
    // If we are on the first call then we start a chainable middleware.
    if (this === exports) {
      var tagMiddleware = function (ctx, next) {
        var res = ctx.res
        var first = !ctx.page
        var page = ctx.page = ctx.page || new Head()
        var tags = tagMiddleware._tags

        for (var i = 0, len = tags.length, tag; i < len; i++) {
          tag = tags[i]
          page[tag[0]](tag[1])
        }

        if (!first) return next()
        return next().then(function () {
          var contentType = res.get('Content-Type')
          if (!contentType || contentType.slice(0, 9) !== 'text/html') return
          var body = res.body
          if (typeof res.body === 'string') body = Buffer.from(body)

          var output = combinedStream.create()
          output.append(Buffer.from('<!DOCTYPE html><html><head>' + page.renderToString() + '</head><body>'))
          output.append(body)
          output.append(Buffer.from('</body></html>'))
          res.body = output
        })
      }

      tagMiddleware._tags = [[tag, attrs]]
      return Object.assign(tagMiddleware, exports)
    }

    // Otherwise we just add more tags.
    this._tags.push([tag, attrs])
    return this
  }
})
