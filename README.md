# kerouac-sitemap

[Kerouac](https://github.com/jaredhanson/kerouac) middleware that generates
generates [sitemaps](http://www.sitemaps.org/), informing search engines about
pages that are available for crawling

Status:
[![Version](https://img.shields.io/npm/v/kerouac-sitemap.svg?label=version)](https://www.npmjs.com/package/kerouac-sitemap)
[![Build](https://img.shields.io/travis/jaredhanson/kerouac-sitemap.svg)](https://travis-ci.org/jaredhanson/kerouac-sitemap)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/kerouac-sitemap.svg?label=quality)](https://codeclimate.com/github/jaredhanson/kerouac-sitemap)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/kerouac-sitemap.svg)](https://coveralls.io/r/jaredhanson/kerouac-sitemap)
[![Dependencies](https://img.shields.io/david/jaredhanson/kerouac-sitemap.svg)](https://david-dm.org/jaredhanson/kerouac-sitemap)

## Sponsorship

Kerouac is open source software.  Ongoing development is made possible by
generous contributions from individuals and corporations.  To learn more about
how you can help keep this project financially sustainable, please visit Jared
Hanson's page on [Patreon](https://www.patreon.com/jaredhanson).

## Install

    $ npm install kerouac-sitemap
    
## Usage

Simply declare a `sitemap.xml` page, using this middleware.

```js
site.page('/sitemap.xml', require('kerouac-sitemap')());
```

If your site consists of multiple sections, each of which has a separate
sitemap, a sitemap index can be generated.

```js
site.page('/sitemap_index.xml', require('kerouac-sitemap').index());
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2018 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
