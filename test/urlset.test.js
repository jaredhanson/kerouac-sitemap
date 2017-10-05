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
  
  describe('with assets', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/hello.html' },
            { url: '/assets/script.js' },
            { url: '/assets/stylesheet.css' }
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
        '    <loc>http://www.example.com/hello.html</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with one page
  
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
  
  describe('with site containing .htaccess', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/.htaccess' },
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
  }); // with site containing .htaccess files
  
});
