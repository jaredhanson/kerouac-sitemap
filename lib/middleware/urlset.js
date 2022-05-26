var path = require('path')
  , builder = require('xmlbuilder');


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
  
  var extIncludes = [
    '.html',
  ];
  
  var fileExcludes = [
    // Used by Apache to make configuration changes on a per-directory basis
    //   https://httpd.apache.org/docs/current/howto/htaccess.html
    '.htaccess',
    // Used by GitHub Pages when setting up a custom domain
    //   https://help.github.com/articles/using-a-custom-domain-with-github-pages/
    //   https://help.github.com/articles/setting-up-a-www-subdomain/
    //   https://help.github.com/articles/setting-up-a-custom-subdomain/
    //   https://help.github.com/articles/troubleshooting-custom-domains/
    'CNAME',
    'robots.txt'
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
    
    var pages
      , res, rbase, rext, smu, i, len;
      
    pages = (page.locals && page.locals.pages) || []
    pages = pages.filter(function(p) { return p.app === page.app; });
    
    var sm = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    sm.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for (i = 0, len = pages.length; i < len; i++) {
      res = pages[i];
      
      // if the resource is a sitemap, omit
      if (res.isSitemap || res.sitemapIndex) { continue; }
      
      // if the resource has already been included in another sitemap, omit
      if (res._inSitemap) { continue; }
      
      rbase = path.basename(res.url);
      rext = path.extname(res.url);
      
      if (fileExcludes.indexOf(rbase) != -1) { continue; }
      if (rext && extIncludes.indexOf(rext) == -1) { continue; }
      
      if (!res.fullURL) { return next(new Error('Unable to add "' + res.absoluteURL + '" to sitemap, set \'base url\' setting and try again')); }
      
      smu = sm.e('url');
      smu.e('loc', res.fullURL);
      if (res.modifiedAt) { smu.e('lastmod', res.modifiedAt.toISOString().substring(0,19)+'+00:00'); }
      
      res._inSitemap = page.absoluteURL;
    }
    
    var xml = sm.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
