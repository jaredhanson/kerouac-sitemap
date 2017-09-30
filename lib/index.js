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
      , pg, purl, pext, i, len;
    
    // TODO: next with error if no page.pages...
    
    var url = uri.parse(site.get('base url'));
    
    var sm = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    sm.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for (i = 0, len = pages.length; i < len; i++) {
      pg = pages[i]
      purl = pg.url;
      pext = path.extname(purl);
      
      if (pg.sitemap) { continue; }
      if (pathExcludes.indexOf(purl) != -1) { continue; }
      if (extExcludes.indexOf(pext) != -1) { continue; }
      
      url.pathname = purl;
      
      sm.e('url')
          .e('loc', uri.format(url));
    }
    
    var xml = sm.end({ pretty: true });
    page.write(xml);
    page.end();
  };
  
  
  return function sitemap(site, pages) {
    if (!site.get('base url')) throw new Error('sitemap requires "base url" setting');
    
    var uri = url.parse(site.get('base url'));
    
    site.page('/sitemap.xml', function(page, next) {
      page.sitemap = true;
      
      var sm = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
      sm.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
      
      var paths = Object.keys(pages).sort()
        , pg
        , ext;
      for (var i = 0, len = paths.length; i < len; i++) {
        pg = pages[paths[i]];
        ext = path.extname(pg.path);
        
        if (pg.sitemap) { continue; }
        if (pathExcludes.indexOf(pg.path) != -1) { continue; }
        if (extExcludes.indexOf(ext) != -1) { continue; }
        
        uri.pathname = pg.path;
        
        sm.e('url')
            .e('loc', url.format(uri));
      }
      
      var xml = sm.end({ pretty: true });
      page.write(xml);
      page.end();
    })
  }
}
