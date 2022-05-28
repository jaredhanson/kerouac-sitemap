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
  
  it('should include multiple sitemaps', function(done) {
    chai.kerouac.use(sitemap.index())
      .request(function(page) {
        page.locals = {};
        page.locals.sitemaps = [
          { fullURL: 'http://www.example.com/sitemap.xml', isSitemap: true },
          { fullURL: 'http://www.example.com/blog/sitemap.xml', isSitemap: true }
        ];
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <sitemap>',
          '    <loc>http://www.example.com/sitemap.xml</loc>',
          '  </sitemap>',
          '  <sitemap>',
          '    <loc>http://www.example.com/blog/sitemap.xml</loc>',
          '  </sitemap>',
          '</sitemapindex>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        expect(this.isSitemap).to.equal(true);
        expect(this.locals.sitemaps[0].isInSitemap).to.equal(true);
        expect(this.locals.sitemaps[1].isInSitemap).to.equal(true);
        done();
      })
      .generate();
  }); // should include multiple sitemaps
  
  it('should not include sitemaps which are already in a sitemap', function(done) {
    chai.kerouac.use(sitemap.index())
      .request(function(page) {
        page.locals = {};
        page.locals.sitemaps = [
          { fullURL: 'http://www.example.com/sitemap.xml', isSitemap: true },
          { fullURL: 'http://www.example.com/blog/sitemap.xml', isSitemap: true, isInSitemap: true }
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
        done();
      })
      .generate();
  }); // should not include sitemaps which are already in a sitemap
  
  it('should error when fully-qualified URL is not known', function(done) {
    chai.kerouac.use(sitemap.index())
      .request(function(page) {
        page.locals = {};
        page.locals.sitemaps = [
          { absoluteURL: '/sitemap.xml', isSitemap: true }
        ];
      })
      .next(function(err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('Unable to add "/sitemap.xml" to sitemap, set \'base url\' setting and try again');
        done();
      })
      .generate();
  }); // should error when fully-qualified URL is not known
  
});
