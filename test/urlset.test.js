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
    
    it('should set sitemap property', function() {
      expect(page.sitemap).to.equal(true);
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
  }); // with two pages
  
  describe('with one section', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.url = '/blog/sitemap.xml';
          var blog = new mock.Site();
          
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.section = blog;
          page.pages = [
            { url: '/blog', section: blog },
            { url: '/blog/hello', section: blog },
            { url: '/blog/hello-again', section: blog }
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
        '    <loc>http://www.example.com/blog</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/blog/hello</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/blog/hello-again</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemap property', function() {
      expect(page.sitemap).to.equal(true);
    });
    
    it('should set sitemap on section', function() {
      expect(page.section.sitemap).to.be.an('object')
    });
  }); // with one section
  
  describe('with two sections, one of which already has a sitemap', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.url = '/blog/sitemap.xml';
          var blog = new mock.Site();
          var legal = new mock.Site();
          legal.sitemap = { url: '/legal/sitemap.xml' }
          
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.section = blog;
          page.pages = [
            { url: '/blog', section: blog },
            { url: '/blog/hello', section: blog },
            { url: '/blog/hello-again', section: blog },
            { url: '/legal/terms', section: legal },
            { url: '/legal/privacy', section: legal }
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
        '    <loc>http://www.example.com/blog</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/blog/hello</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/blog/hello-again</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemap property', function() {
      expect(page.sitemap).to.equal(true);
    });
    
    it('should set sitemap on section', function() {
      expect(page.section.sitemap).to.be.an('object')
    });
  }); // with two sections, one of which already has a sitemap
  
  describe('with nested sections, neither of which has a sitemap', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          var site = new mock.Site();
          site.set('base url', 'http://www.example.com/');
          var legal = new mock.Site();
          var blog = new mock.Site();
          
          page.url = '/legal/blog/sitemap.xml';
          page.site = site;
          page.section = blog;
          page.pages = [
            { url: '/legal/blog', section: blog },
            { url: '/legal/blog/hello', section: blog },
            { url: '/legal/blog/hello-again', section: blog },
            { url: '/legal/terms', section: legal },
            { url: '/legal/privacy', section: legal }
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
        '    <loc>http://www.example.com/legal/blog</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/legal/blog/hello</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/legal/blog/hello-again</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemap property', function() {
      expect(page.sitemap).to.equal(true);
    });
    
    it('should set sitemap on section', function() {
      expect(page.section.sitemap).to.be.an('object')
    });
  }); // with nested sections, neither of which has a sitemap
  
  describe('with nested sections, deepest of which has a sitemap', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          var site = new mock.Site();
          site.set('base url', 'http://www.example.com/');
          var legal = new mock.Site();
          var blog = new mock.Site();
          blog.sitemap = { url: '/legal/blog/sitemap.xml' }
          
          page.url = '/legal/sitemap.xml';
          page.site = site;
          page.section = legal;
          page.pages = [
            { url: '/legal/blog', section: blog },
            { url: '/legal/blog/hello', section: blog },
            { url: '/legal/blog/hello-again', section: blog },
            { url: '/legal/terms', section: legal },
            { url: '/legal/privacy', section: legal }
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
        '    <loc>http://www.example.com/legal/terms</loc>',
        '  </url>',
        '  <url>',
        '    <loc>http://www.example.com/legal/privacy</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemap property', function() {
      expect(page.sitemap).to.equal(true);
    });
    
    it('should set sitemap on section', function() {
      expect(page.section.sitemap).to.be.an('object')
    });
  }); // with nested sections, deepest of which has a sitemap
  
  describe('global sitemap with nested sections', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          var site = new mock.Site();
          site.set('base url', 'http://www.example.com/');
          var legal = new mock.Site();
          legal.sitemap = { url: '/legal/sitemap.xml' }
          var blog = new mock.Site();
          blog.sitemap = { url: '/legal/blog/sitemap.xml' }
          var content = new mock.Site();
          
          page.url = '/sitemap.xml';
          page.site = site;
          page.section = site;
          page.pages = [
            { url: '/legal/blog', section: blog },
            { url: '/legal/blog/hello', section: blog },
            { url: '/legal/blog/hello-again', section: blog },
            { url: '/legal/terms', section: legal },
            { url: '/legal/privacy', section: legal },
            { url: '/about', section: content }
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
        '    <loc>http://www.example.com/about</loc>',
        '  </url>',
        '</urlset>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemap property', function() {
      expect(page.sitemap).to.equal(true);
    });
    
    it('should set sitemap on section', function() {
      expect(page.section.sitemap).to.be.an('object')
    });
  }); // global sitemap with nested sections
  
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
  
  describe('with site containing CNAME', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/CNAME' },
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
  }); // with site containing CNAME
  
  describe('without base url setting', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .page(function(page) {
          page.site = new mock.Site();
          page.pages = [
            { url: '/hello' },
          ];
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('sitemaps require "base url" setting');
    });
  }); // without base url setting
  
});
