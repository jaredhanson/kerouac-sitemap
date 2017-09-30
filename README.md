# kerouac-sitemap

This is a [Kerouac](https://github.com/jaredhanson/kerouac) plugin that
generates a [sitemap](http://www.sitemaps.org/), informing search engines about
pages that are available for crawling

## Install

    $ npm install kerouac-sitemap
    
## Usage

Simply plug `kerouac-sitemap` into your site.  The generated output will include
a `/sitemap.xml` resource.

    site.plug(require('kerouac-sitemap')());

## Tests

    $ npm install
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/kerouac-sitemap.png)](http://travis-ci.org/jaredhanson/kerouac-sitemap)  [![David DM](https://david-dm.org/jaredhanson/kerouac-sitemap.png)](http://david-dm.org/jaredhanson/kerouac-sitemap)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2017 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/kerouac-sitemap'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/kerouac-sitemap.svg' />
</a>
