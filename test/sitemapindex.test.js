var chai = require('chai');
var mock = require('chai-kerouac-middleware');
var sitemap = require('../lib');


describe('sitemapindex', function() {
  
  it('should export function', function() {
    expect(sitemap.index).to.be.a('function');
  });
  
  describe('with one sitemap', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index())
        .request(function(page) {
          page.absoluteURL = '/sitemap_index.xml';
          
          page.locals = {};
          page.locals.sitemaps = [
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
            { url: '/sitemap.xml', fullURL: 'http://www.example.com/sitemap.xml', sitemap: true }
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
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <sitemap>',
        '    <loc>http://www.example.com/sitemap.xml</loc>',
        '  </sitemap>',
        '</sitemapindex>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemapIndex property', function() {
      expect(page.sitemapIndex).to.equal(true);
    });
    
    it('should not set sitemap property', function() {
      expect(page.sitemap).to.equal(undefined);
    });
    
    it('should add sitemaps to sitemap index', function() {
      expect(page.locals.sitemaps[0]._inSitemap).to.equal(undefined);
      expect(page.locals.sitemaps[1]._inSitemap).to.equal('/sitemap_index.xml');
    });
  }); // with one sitemap
  
  describe('with two sitemaps', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index())
        .request(function(page) {
          page.locals = {};
          page.locals.sitemaps = [
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
            { url: '/sitemap1.xml', fullURL: 'http://www.example.com/sitemap1.xml', sitemap: true },
            { url: '/sitemap2.xml', fullURL: 'http://www.example.com/sitemap2.xml', sitemap: true }
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
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <sitemap>',
        '    <loc>http://www.example.com/sitemap1.xml</loc>',
        '  </sitemap>',
        '  <sitemap>',
        '    <loc>http://www.example.com/sitemap2.xml</loc>',
        '  </sitemap>',
        '</sitemapindex>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with two sitemaps
  
  describe('with two sitemaps, one of which is already in a sitemap index', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index())
        .request(function(page) {
          page.locals = {};
          page.locals.sitemaps = [
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
            { url: '/sitemap1.xml', fullURL: 'http://www.example.com/sitemap1.xml', sitemap: true },
            { url: '/foo/sitemap2.xml', fullURL: 'http://www.example.com/sitemap2.xml', sitemap: true, _inSitemap: '/foo/sitemapindex.xml' }
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
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <sitemap>',
        '    <loc>http://www.example.com/sitemap1.xml</loc>',
        '  </sitemap>',
        '</sitemapindex>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with two sitemaps, one of which is already in a sitemap index
  
  describe('without base url setting', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index())
        .request(function(page) {
          page.locals = {};
          page.locals.sitemaps = [
            { url: '/hello' },
            { url: '/sitemap.xml', absoluteURL: '/sitemap.xml', sitemap: true }
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
      expect(err.message).to.equal('Unable to add "/sitemap.xml" to sitemap, set \'base url\' setting and try again');
    });
  }); // without base url setting
  
  describe.skip('with two sitemaps in parent site, with mounted option', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index({ mounted: true }))
        .request(function(page) {
          page.locals = {};
          page.locals.parent = {};
          page.locals.parent.sitemaps = [
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
            { url: '/sitemap1.xml', fullURL: 'http://www.example.com/sitemap1.xml', sitemap: true },
            { url: '/sitemap2.xml', fullURL: 'http://www.example.com/sitemap2.xml', sitemap: true }
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
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <sitemap>',
        '    <loc>http://www.example.com/sitemap1.xml</loc>',
        '  </sitemap>',
        '  <sitemap>',
        '    <loc>http://www.example.com/sitemap2.xml</loc>',
        '  </sitemap>',
        '</sitemapindex>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with two sitemaps in parent site, with mounted option
  
});
