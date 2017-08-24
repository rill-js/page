'use strict'

var Page = require('set-page/src/browser')

// Add middleware for each type of tag.
Page.TAGS.forEach(function (tag) {
  exports[tag] = function (attrs) {
    // If we are on the first call then we start a chainable middleware.
    if (this === exports) {
      var tagMiddleware = function (ctx, next) {
        var res = ctx.res
        var first = !ctx.page
        var page = ctx.page = ctx.page || new Page()
        var calls = tagMiddleware._calls

        for (var i = 0, len = calls.length, method, args; i < len; i += 2) {
          method = calls[i]
          args = calls[i + 1]
          page[method](args)
        }

        if (!first) return next()
        return next().then(function () {
          var contentType = res.get('Content-Type')
          if (!contentType || contentType.slice(0, 9) !== 'text/html') return
          page.render()
        })
      }

      tagMiddleware._calls = [tag, attrs]
      return Object.assign(tagMiddleware, exports)
    }

    // Otherwise we just add more calls.
    this._calls.push(tag, attrs)
    return this
  }
})
