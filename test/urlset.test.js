var chai = require('chai');
var mock = require('chai-kerouac-middleware');
var sitemap = require('../lib');


describe('urlset', function() {
  
  it('should export function', function() {
    expect(sitemap).to.be.a('function');
  });
  
  describe('with one page', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/' }
          ];
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should write sitemap.xml', function() {
      var expected = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>http://www.example.com/</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with one page
  
  describe('with two pages', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/' },
            { url: '/contact/' }
          ];
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should write sitemap.xml', function() {
      var expected = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>http://www.example.com/</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/contact/</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemap property', function() {
      expect(page.sitemap).to.equal(true);
    });
  }); // with two pages
  
  describe('with site containing /robots.txt', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/robots.txt' },
            { url: '/hello' },
          ];
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should write sitemap.xml', function() {
      var expected = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>http://www.example.com/hello</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with site containing /robots.txt
  
  describe('with site containing other sitemaps', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/hello' },
            { url: '/stores/store1_sitemap.xml', sitemap: true },
            { url: '/stores/store2_sitemap.xml', sitemap: true },
            { url: '/stores/store3_sitemap.xml', sitemap: true }
          ];
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should write sitemap.xml', function() {
      var expected = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>http://www.example.com/hello</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with site containing other sitemaps
  
  describe('with site containing a sitemap index', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/hello' },
            { url: '/sitemap_index.xml', sitemapIndex: true }
          ];
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should write sitemap.xml', function() {
      var expected = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>http://www.example.com/hello</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with site containing a sitemap index
  
  /*
  
  describe('when invoked on a site with CSS and JavaScript', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    site.page('/hello.html', function(){});
    site.page('/css/site.css', function(){});
    site.page('/js/main.js', function(){});
    
    sitemap()(site, site.pages);
    
    it('should add /sitemap.xml page', function() {
      expect(site.pages).to.include.keys('/sitemap.xml');
    });
    
    describe('and then rendering sitemap.xml', function() {
      var p = site.pages['/sitemap.xml'];

      it('should write .htaccess', function(done) {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.html</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked on a site with multiple sitemaps', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    site.page('/hello.html', function(){});
    site.page('/sitemap2.xml', function(){});
    site.pages['/sitemap2.xml'].sitemap = true;
    
    sitemap()(site, site.pages);
    
    it('should add /sitemap.xml page', function() {
      expect(site.pages).to.include.keys('/sitemap.xml');
    });
    
    describe('and then rendering sitemap.xml', function() {
      var p = site.pages['/sitemap.xml'];

      it('should write .htaccess', function(done) {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.html</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked on a site without base url setting', function() {
    var site = new MockSite();
    
    it('should throw an error', function() {
      expect(function() {
        sitemap()(site, site.pages);
      }).to.throw(/requires \"base url\" setting/);
    });
  });
  */
  
});
