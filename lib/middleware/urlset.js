var path = require('path')
  , builder = require('xmlbuilder');

var IGNORE = [
  'robots.txt'
];


/**
 * Sitemap middleware.
 *
 * This middleware generates a `sitemap.xml` file, informing search engines
 * about pages on the site that are available for crawling.
 *
 * Sitemaps originated from Google, which announced the initial version 0.84 in
 * June 2005.  This version of Sitemaps used the XML namespace `http://www.google.com/schemas/sitemap/0.84`.
 * The announcement was published to Google's blog and is available at:
 *   - https://googleblog.blogspot.com/2005/06/webmaster-friendly.html
 *
 * In November 2006, Yahoo! and Microsoft joined Google to implement support
 * for version 0.90.  This version of Sitemaps uses the XML namespace `http://www.sitemaps.org/schemas/sitemap/0.9`.
 * It is otherwise unchanged from the previous version 0.84.  The announcement
 * of joint support is available at:
 *   - https://googlepress.blogspot.com/2006/11/major-search-engines-unite-to-support_16.html
 *   - https://webmasters.googleblog.com/2006/11/joint-support-for-sitemap-protocol.html
 *   - http://web.archive.org/web/20061128045658/http://www.ysearchblog.com:80/archives/000380.html
 *
 * Sitemaps are auto-discovered by web crawlers via robots.txt.  The major
 * search engines support a 'Sitemap' directive, as announced in 2007:
 *   - http://web.archive.org/web/20070414061303/http://www.ysearchblog.com:80/archives/000437.html
 *
 * Google provides guidance on how webmasters should build and manage sitemaps,
 * including tips for what URLs and metadata to include for optimal results:
 *   - [Learn about sitemaps](https://support.google.com/webmasters/answer/156184)
 *   - [Build and submit a sitemap](https://support.google.com/webmasters/answer/183668)
 *   - [Simplify multiple sitemap management](https://support.google.com/webmasters/answer/75712)
 *
 * References:
 *   - [Sitemaps XML format](https://www.sitemaps.org/protocol.html)
 *   - [Sitemaps](https://en.wikipedia.org/wiki/Sitemaps)
 */
exports = module.exports = function(options) {
  options = options || {};
  
  var incExtensions = options.includeExtensions || [
    '.html',
  ];
  
  // TODO: Implement support for image sitemaps
  //       https://support.google.com/webmasters/answer/178636
  
  // TODO: Implement support for video sitemaps
  //       https://support.google.com/webmasters/answer/80471
  //       https://developers.google.com/webmasters/videosearch/sitemaps
  
  // TODO: Implement support for indicating alternate languages
  //       https://support.google.com/webmasters/answer/2620865
  
  
  return function sitemap(page, next) {
    page.isSitemap = true;
    
    var urlset = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' })
      , pages = (page.locals && page.locals.pages) || []
      , pg, base, ext, url, i, len;
    
    urlset.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    pages = pages.filter(function(p) { return p.app === page.app; });
    
    for (i = 0, len = pages.length; i < len; i++) {
      pg = pages[i];
      
      if (pg.isSitemap || pg.isInSitemap) { continue; }
      
      base = path.basename(pg.path);
      ext = path.extname(base);
      if (IGNORE.indexOf(base) != -1) { continue; }
      if (incExtensions.indexOf(ext) == -1) { continue; }
      
      if (!pg.fullURL) { return next(new Error('Unable to add "' + pg.absoluteURL + '" to sitemap, set \'base url\' setting and try again')); }
      
      url = urlset.e('url');
      url.e('loc', pg.fullURL);
      if (pg.modifiedAt) { url.e('lastmod', pg.modifiedAt.toISOString().substring(0,19)+'+00:00'); }
      
      pg.isInSitemap = true;
    }
    
    var xml = urlset.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
