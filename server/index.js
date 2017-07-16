'use strict'

var Head = require('set-head')

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
          res.body = '<!DOCTYPE html><html><head>' + page.renderToString() + '</head><body>' + res.body + '</body>'
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
