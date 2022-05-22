var chai = require('chai');
var mock = require('chai-kerouac-middleware');
var sitemap = require('../lib');


describe('urlset', function() {
  
  it('should export function', function() {
    expect(sitemap).to.be.a('function');
  });
  
  it('should include location of URL', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml'
        page.locals = {};
        page.locals.pages = [
          { url: '/', fullURL: 'http://www.example.com/' }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.sitemap).to.equal(true);
        expect(this.locals.pages[0]._inSitemap).to.equal('/sitemap.xml');
        done();
      })
      .generate();
  }); // should include location of URL
  
  it('should include date of last modification of URL', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.locals = {};
        page.locals.pages = [
          { url: '/',
            fullURL: 'http://www.example.com/',
            modifiedAt: new Date(Date.UTC(2017, 8, 3, 17, 30, 15)) }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/</loc>',
          '    <lastmod>2017-09-03T17:30:15+00:00</lastmod>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.sitemap).to.equal(true);
        done();
      })
      .generate();
  }); // should include date of last modification of URL
  
  it('should include location of multiple URLs', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.locals = {};
        page.locals.pages = [
          { url: '/', fullURL: 'http://www.example.com/' },
          { url: '/contact/', fullURL: 'http://www.example.com/contact/' }
        ];
      })
      .finish(function() {
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
    
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  }); // should include location of multiple URLs
  
  describe('with multiple pages, some of which are already in a sitemap', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/blog', fullURL: 'http://www.example.com/blog' },
            { url: '/blog/hello', fullURL: 'http://www.example.com/blog/hello' },
            { url: '/blog/hello-again', fullURL: 'http://www.example.com/blog/hello-again' },
            { url: '/legal/terms', fullURL: 'http://www.example.com/legal/terms', _inSitemap: '/legal/sitemap.xml' },
            { url: '/legal/privacy', fullURL: 'http://www.example.com/legal/privacy', _inSitemap: '/legal/sitemap.xml' }
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
  }); // with multiple pages, some of which are already in a sitemap
  
  describe('with assets', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/hello.html', fullURL: 'http://www.example.com/hello.html' },
            { url: '/assets/script.js', fullURL: 'http://www.example.com/assets/script.js' },
            { url: '/assets/stylesheet.css', fullURL: 'http://www.example.com/assets/stylesheet.css' }
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
  
  describe('with site containing robots.txt', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/robots.txt', fullURL: 'http://www.example.com/robots.txt' },
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
  }); // with site containing robots.txt
  
  describe('with site containing other sitemaps', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
            { url: '/stores/store1_sitemap.xml', fullURL: 'http://www.example.com/stores/store1_sitemap.xml', sitemap: true },
            { url: '/stores/store2_sitemap.xml', fullURL: 'http://www.example.com/stores/store2_sitemap.xml', sitemap: true },
            { url: '/stores/store3_sitemap.xml', fullURL: 'http://www.example.com/stores/store3_sitemap.xml', sitemap: true }
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
            { url: '/sitemap_index.xml', fullURL: 'http://www.example.com/sitemap_index.xml', sitemapIndex: true }
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/.htaccess', fullURL: 'http://www.example.com/.htaccess' },
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/CNAME', fullURL: 'http://www.example.com/CNAME' },
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
        .request(function(page) {
          page.locals = {};
          page.locals.pages = [
            { url: '/hello', absoluteURL: '/hello' },
          ];
        })
        .next(function(e) {
          err = e;
          done();
        })
        .generate();
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Unable to add "/hello" to sitemap, set \'base url\' setting and try again');
    });
  }); // without base url setting
  
  describe.skip('with two pages in parent site, with mounted option', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap({ mounted: true }))
        .request(function(page) {
          page.locals = {};
          page.locals.parent = {};
          page.locals.parent.pages = [
            { url: '/', fullURL: 'http://www.example.com/' },
            { url: '/contact/', fullURL: 'http://www.example.com/contact/' }
          ];
        })
        .finish(function() {
          page = this;
          done();
        })
        .generate();
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
  }); // with two pages in parent site, with mounted option
  
});
