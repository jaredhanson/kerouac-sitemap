var chai = require('chai');
var mock = require('chai-kerouac-middleware');
var sitemap = require('../../lib');


describe('middleware/sitemapindex', function() {
  
  it('should include sitemap', function(done) {
    chai.kerouac.use(sitemap.index())
      .request(function(page) {
        page.absoluteURL = '/sitemap_index.xml';
        page.locals = {};
        page.locals.sitemaps = [
          { fullURL: 'http://www.example.com/sitemap.xml', isSitemap: true }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <sitemap>',
          '    <loc>http://www.example.com/sitemap.xml</loc>',
          '  </sitemap>',
          '</sitemapindex>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.sitemaps[0].isInSitemap).to.equal(true);
        done();
      })
      .generate();
  }); // should include sitemap
  
  describe('with two sitemaps', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index())
        .request(function(page) {
          page.locals = {};
          page.locals.sitemaps = [
            { url: '/hello', fullURL: 'http://www.example.com/hello' },
            { url: '/sitemap1.xml', fullURL: 'http://www.example.com/sitemap1.xml', isSitemap: true },
            { url: '/sitemap2.xml', fullURL: 'http://www.example.com/sitemap2.xml', isSitemap: true }
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
            { url: '/sitemap1.xml', fullURL: 'http://www.example.com/sitemap1.xml', isSitemap: true },
            { url: '/foo/sitemap2.xml', fullURL: 'http://www.example.com/sitemap2.xml', isSitemap: true, isInSitemap: true }
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
            { url: '/sitemap.xml', absoluteURL: '/sitemap.xml', isSitemap: true }
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
            { url: '/sitemap1.xml', fullURL: 'http://www.example.com/sitemap1.xml', isSitemap: true },
            { url: '/sitemap2.xml', fullURL: 'http://www.example.com/sitemap2.xml', isSitemap: true }
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
