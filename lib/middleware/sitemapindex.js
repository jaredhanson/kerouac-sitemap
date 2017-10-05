var uri = require('url')
  , builder = require('xmlbuilder');


exports = module.exports = function() {
  
  // https://webmasters.googleblog.com/2006/10/multiple-sitemaps-in-same-directory.html
  // https://sitemaps.blogspot.com/2005/08/using-sitemap-index-files.html
  
  return function sitemapindex(page, next) {
    page.sitemapIndex = true;
    
    var site = page.site
      , pages = page.pages
      , res, i, len;
    
    // TODO: next with error if no page.pages...
    
    var url = uri.parse(site.get('base url'));
    
    var sm = builder.create('sitemapindex', { version: '1.0', encoding: 'UTF-8' });
    sm.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    pages = pages.filter(function(p) {
      return p.sitemap == true;
    });
    
    for (i = 0, len = pages.length; i < len; i++) {
      url.pathname = pages[i].url;
      
      sm.e('sitemap')
          .e('loc', uri.format(url));
    }
    
    var xml = sm.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
