<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/page
  <br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/page">
    <img src="https://img.shields.io/npm/v/@rill/page.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/page">
    <img src="https://img.shields.io/npm/dm/@rill/page.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Full page <head> management for [Rill](https://github.com/rill-js/rill).
Updating the document is done using the [set-page](https://github.com/DylanPiercey/set-page) library, with the same api (excluding render).

# Installation

```console
npm install @rill/page
```

# Example

```javascript
const app = require('rill')()
const page = require('@rill/page')
const React = require('react')
const renderer = require('@rill/react')

// Set default <head> tags (can override later).
// Must come before render middleware.
app.get(page
  .html({ lang: 'en' })
  .body({ class: 'loading' })
  .meta({ charset: 'utf8' })
  .title('My App')
  .meta({ name: 'author', content: 'Dylan Piercey' })
  .meta({ name: 'descripton', content: 'It is very cool' })
  .link({ rel: 'stylesheet', href: 'index.css' })
  .script({ src: 'index.js', async: true })
)

// Setup React rendering in Rill as an example, but any will do.
app.use(renderer({ root: 'body' }))

app.get('/admin',
  // Override the title for the admin page.
  page.title('My App > Admin'),
  ({ req, res, page }, next)=> {
    // You can also override dynamically by accessing `page` from the context.
    page.meta({ name: 'description', content: 'Updated description' })

    // @rill/page will wrap any html already rendered (in this case jsx) with a document.
    res.body = <div>Hello World</div>

    // On the server the final response will be. (formatted for clarity)
    html`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf8">
          <title>My App > Admin</title>
          <meta name="author" name="Dylan Piercey">
          <meta name="description" content="Updated description">
          <link rel="stylesheet" href="index.css">
          <script src="index.js" async></script>
        </head>
        <body>
          <div>Hello World</div>
        </body>
      </html>
    `
  }
)
```

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
