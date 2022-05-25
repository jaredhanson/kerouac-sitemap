# kerouac-sitemap

[Kerouac](https://github.com/jaredhanson/kerouac) middleware that generates
[sitemaps](https://www.sitemaps.org/), informing search engines about pages that
are available for crawling.

## Install

```sh
$ npm install kerouac-sitemap
```

## Usage

Declare a `sitemap.xml` route, using this middleware.

```js
var sitemap = require('kerouac-sitemap');

site.page('/sitemap.xml', sitemap());
```

And map a `sitemap.xml` file when generating the site.

```js
site.generate([
  sitemap.createMapper()
]);
```

#### Indexes

For a site that consists of multiple sections, each section can have its own
sitemap with each sitemap listed in a sitemap index.

```js
var sitemap = require('kerouac-sitemap');

var site = kerouac();

var docs = kerouac();
docs.page('/sitemap.xml', sitemap());

site.use('/docs', docs);
site.page('/sitemap.xml', sitemap());
site.page('/sitemap-index.xml', sitemap.index());

site.generate({
  '/docs': [
    sitemap.createMapper(),
  ],
  '/': [
    sitemap.createMapper({ index: true }),
  ],
});
```

## License

[The MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2012-2022 Jared Hanson <[https://www.jaredhanson.me/](https://www.jaredhanson.me/)>
