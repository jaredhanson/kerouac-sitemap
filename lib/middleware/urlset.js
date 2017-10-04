var path = require('path')
  , uri = require('url')
  , builder = require('xmlbuilder');

// TODO: Implement support for sitemaps in directories.

// http://www.sitemaps.org/protocol.html
// http://support.google.com/webmasters/bin/answer.py?hl=en&answer=156184&topic=8476&ctx=topic

/**
 * Sitemap middleware.
 *
 * This middleware generates a `sitemap.xml` file, informing search engines
 * about pages on the site that are available for crawling.
 *
 * This middleware is section-aware, and will generate one sitemap per section.
 * If a page is not contained in a section, or is contained within a section for
 * which a sitemap has not been generated, then the page will be included in the
 * top-level sitemap.
 *
 * References:
 *   - [Sitemaps XML format](https://www.sitemaps.org/protocol.html)
 */
exports = module.exports = function() {
  
  var pathExcludes = [
    '/.htaccess',
    '/robots.txt',
    '/CNAME'        // https://help.github.com/articles/setting-up-a-custom-domain-with-pages
  ];
  
  var extExcludes = [
    '.css',
    '.js',
    '.gif',
    '.jpg',
    '.png',
    '.ico'
  ];
  
  
  return function sitemap(page, next) {
    page.sitemap = true;
    
    var site = page.site
      , pages = page.pages
      , res, rurl, rext, i, len;
    
    // TODO: next with error if no page.pages...
    
    var url = uri.parse(site.get('base url'));
    
    var sm = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    sm.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for (i = 0, len = pages.length; i < len; i++) {
      res = pages[i];
      
      // if the resource has already been included in another sitemap, omit
      if (res.section && res.section.sitemap) { continue; }
      
      // if the resource is a sitemap, omit
      if (res.sitemap) { continue; }
      
      
      rurl = res.url;
      rest = path.extname(rurl);
      
      if (pathExcludes.indexOf(rurl) != -1) { continue; }
      if (extExcludes.indexOf(rext) != -1) { continue; }
      
      url.pathname = rurl;
      
      sm.e('url')
          .e('loc', uri.format(url));
    }
    
    // Record the sitemap for this section.
    if (page.section) { page.section.sitemap = page; }
    
    var xml = sm.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
