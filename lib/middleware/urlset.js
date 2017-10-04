var path = require('path')
  , uri = require('url')
  , builder = require('xmlbuilder');

// TODO: Implement support for sitemaps in directories.

// http://www.sitemaps.org/protocol.html
// http://support.google.com/webmasters/bin/answer.py?hl=en&answer=156184&topic=8476&ctx=topic

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
