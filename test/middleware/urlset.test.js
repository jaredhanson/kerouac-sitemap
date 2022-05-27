var chai = require('chai');
var mock = require('chai-kerouac-middleware');
var sitemap = require('../../lib');


describe('middleware/urlset', function() {
  
  it('should include location of URL', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/index.html', url: '/', fullURL: 'http://www.example.com/' }
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
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        done();
      })
      .generate();
  }); // should include location of URL
  
  it('should include date of last modification of URL', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/index.html',
            url: '/',
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
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        done();
      })
      .generate();
  }); // should include date of last modification of URL
  
  it('should include multiple URLs', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/index.html', url: '/', fullURL: 'http://www.example.com/' },
          { path: '/about.html', url: '/about/', fullURL: 'http://www.example.com/contact/' }
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
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        expect(this.locals.pages[1].isInSitemap).to.equal(true);
        done();
      })
      .generate();
  }); // should include multiple URLs
  
  it('should only include URLs which are HTML format', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/hello.html', url: '/hello.html', fullURL: 'http://www.example.com/hello.html' },
          { path: '/assets/script.js', url: '/assets/script.js', fullURL: 'http://www.example.com/assets/script.js' },
          { path: '/assets/stylesheet.css', url: '/assets/stylesheet.css', fullURL: 'http://www.example.com/assets/stylesheet.css' }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.html</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        expect(this.locals.pages[1].isInSitemap).to.be.undefined;
        expect(this.locals.pages[2].isInSitemap).to.be.undefined;
        done();
      })
      .generate();
  }); // should only include URLs which are HTML format
  
  it('should not include URLs which are already in a sitemap', function(done) {
    chai.kerouac.use(sitemap())
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/blog/index.html', url: '/blog/', fullURL: 'http://www.example.com/blog/', isInSitemap: true },
          { path: '/blog/hello.html', url: '/blog/hello/', fullURL: 'http://www.example.com/blog/hello/', isInSitemap: true },
          { path: '/blog/hello-again.html', url: '/blog/hello-again/', fullURL: 'http://www.example.com/blog/hello-again/', isInSitemap: true },
          { path: '/legal/terms.html', url: '/legal/terms/', fullURL: 'http://www.example.com/legal/terms/'  },
          { path: '/legal/privacy.html', url: '/legal/privacy/', fullURL: 'http://www.example.com/legal/privacy/' }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/legal/terms/</loc>',
          '  </url>',
          '  <url>',
          '    <loc>http://www.example.com/legal/privacy/</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        expect(this.locals.pages[1].isInSitemap).to.equal(true);
        expect(this.locals.pages[2].isInSitemap).to.equal(true);
        expect(this.locals.pages[3].isInSitemap).to.equal(true);
        expect(this.locals.pages[4].isInSitemap).to.equal(true);
        done();
      })
      .generate();
  }); // should not include URLs which are already in a sitemap
  
  it('should include URLs which are TXT format when option is set but exclude robots.txt', function(done) {
    chai.kerouac.use(sitemap({ include: [ '.txt' ] }))
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/hello.txt', url: '/hello.txt', fullURL: 'http://www.example.com/hello.txt' },
          { path: '/robots.txt', url: '/robots.txt', fullURL: 'http://www.example.com/robots.txt' }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.txt</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        expect(this.locals.pages[1].isInSitemap).to.be.undefined;
        done();
      })
      .generate();
  }); // should include URLs which are TXT format when option is set but exclude robots.txt
  
  it('should include URLs which are XML format when option is set but exclude sitemaps', function(done) {
    chai.kerouac.use(sitemap({ include: [ '.xml' ] }))
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/hello.xml', url: '/hello.xml', fullURL: 'http://www.example.com/hello.xml' },
          { path: '/blog/sitemap.xml', url: '/blog/sitemap.xml', fullURL: 'http://www.example.com/blog/sitemap.xml', isSitemap: true }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.xml</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        expect(this.locals.pages[1].isInSitemap).to.be.undefined;
        done();
      })
      .generate();
  }); // should include URLs which are XML format when option is set but exclude sitemaps
  
  it('should include URLs which are XML format when option is set but exclude sitemap indexes', function(done) {
    chai.kerouac.use(sitemap({ include: [ '.xml' ] }))
      .request(function(page) {
        page.absoluteURL = '/sitemap.xml';
        page.locals = {};
        page.locals.pages = [
          { path: '/hello.xml', url: '/hello.xml', fullURL: 'http://www.example.com/hello.xml' },
          { path: '/sitemap_index.xml', url: '/sitemap_index.xml', fullURL: 'http://www.example.com/sitemap_index.xml', isSitemap: true }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.xml</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.pages[0].isInSitemap).to.equal(true);
        expect(this.locals.pages[1].isInSitemap).to.be.undefined;
        done();
      })
      .generate();
  }); // should include URLs which are XML format when option is set but exclude sitemap indexes
  
  describe('with site containing .htaccess', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap())
        .request(function(page) {
          page.absoluteURL = '/sitemap.xml';
          page.locals = {};
          page.locals.pages = [
            { path: '/.htaccess', url: '/.htaccess', fullURL: 'http://www.example.com/.htaccess' },
            { path: '/hello.html', url: '/hello', fullURL: 'http://www.example.com/hello' },
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
          page.absoluteURL = '/sitemap.xml';
          page.locals = {};
          page.locals.pages = [
            { path: '/CNAME', url: '/CNAME', fullURL: 'http://www.example.com/CNAME' },
            { path: '/hello.html', url: '/hello', fullURL: 'http://www.example.com/hello' },
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
          page.absoluteURL = '/sitemap.xml';
          page.locals = {};
          page.locals.pages = [
            { path: '/hello.html', url: '/hello', absoluteURL: '/hello' },
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
  
});
