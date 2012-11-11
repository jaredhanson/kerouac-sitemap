var builder = require('xmlbuilder');

// TODO: Implement support for sitemaps in directories.

// http://www.sitemaps.org/protocol.html

exports = module.exports = function(host) {
  // strip trailing slash
  if ('/' == host[host.length - 1]) {
    host = host.slice(0, -1);
  }
  
  return function sitemap(site, pages) {
    site.page('/sitemap.xml', function(page, next) {
      page.sitemap = true;
      
      var sm = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
      sm.a('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
      
      var paths = Object.keys(pages).sort()
        , page;
      for (var i = 0, len = paths.length; i < len; i++) {
        page = pages[paths[i]];
        if (page.sitemap) { continue; }
        
        sm.e('url')
            .e('loc', host + page.path);
      }
      
      var xml = sm.end({ pretty: true });
      console.log(xml)
      page.write(xml);
    })
  }
}
