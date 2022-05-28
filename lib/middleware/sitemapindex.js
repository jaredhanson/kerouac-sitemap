var builder = require('xmlbuilder');


/**
 * Sitemap index middleware.
 *
 * This middleware generates a sitemap index file, which is used to group
 * multiple sitemaps, informing search engines about pages on the site that are
 * available for crawling.
 *
 * While a convention has formed to use "sitemap.xml" as the name of a sitemap
 * file, no such collective agreement has formed around what to name a sitemap
 * index.  Google has published blog posts that use "sitemap_index.xml":
 *   - https://sitemaps.blogspot.com/2005/08/using-sitemap-index-files.html
 *   - https://webmasters.googleblog.com/2006/10/multiple-sitemaps-in-same-directory.html
 *
 * While there is no requirement to use any particular file name, evidence
 * indicates that the web has followed Google's example and "sitemap_index.xml"
 * occurs most commonly, followed by "sitemapindex.xml".  This research is
 * detailed in an analysis of robots.txt files performed by Intoli:
 *   - https://intoli.com/blog/analyzing-one-million-robots-txt-files/
 */
exports = module.exports = function(options) {
  options = options || {};
  
  return function sitemapindex(page, next) {
    page.isSitemap = true;
    
    var index = builder.create('sitemapindex', { version: '1.0', encoding: 'UTF-8' })
      , pages = (page.locals && page.locals.sitemaps) || []
      , pg, sm, i, len;
    
    index.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for (i = 0, len = pages.length; i < len; i++) {
      pg = pages[i];
      
      if (pg.isInSitemap) { continue; }
      
      if (!pg.fullURL) { return next(new Error('Unable to add "' + pg.absoluteURL + '" to sitemap, set \'base url\' setting and try again')); }
      
      sm = index.e('sitemap');
      sm.e('loc', pg.fullURL);
      
      pg.isInSitemap = true;
    }
    
    var xml = index.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
