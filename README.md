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
site.page('/sitemap_index.xml', sitemap.index());

site.generate({
  '/docs': [
    sitemap.createMapper(),
  ],
  '/': [
    sitemap.createMapper({ index: true }),
  ],
});
```

## Authors

- [Jared Hanson](https://www.jaredhanson.me/) { [![WWW](https://raw.githubusercontent.com/jaredhanson/jaredhanson/master/images/globe-12x12.svg)](https://www.jaredhanson.me/) [![Facebook](https://raw.githubusercontent.com/jaredhanson/jaredhanson/master/images/facebook-12x12.svg)](https://www.facebook.com/jaredhanson) [![LinkedIn](https://raw.githubusercontent.com/jaredhanson/jaredhanson/master/images/linkedin-12x12.svg)](https://www.linkedin.com/in/jaredhanson) [![Twitter](https://raw.githubusercontent.com/jaredhanson/jaredhanson/master/images/twitter-12x12.svg)](https://twitter.com/jaredhanson) [![GitHub](https://raw.githubusercontent.com/jaredhanson/jaredhanson/master/images/github-12x12.svg)](https://github.com/jaredhanson) }

## License

[The MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2012-2023 Jared Hanson <[https://www.jaredhanson.me/](https://www.jaredhanson.me/)>
