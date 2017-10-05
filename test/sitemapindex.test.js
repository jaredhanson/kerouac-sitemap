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
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/hello' },
            { url: '/sitemap.xml', sitemap: true }
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
  }); // with one sitemap
  
  describe('with two sitemaps', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index())
        .page(function(page) {
          page.site = new mock.Site();
          page.site.set('base url', 'http://www.example.com/');
          page.pages = [
            { url: '/hello' },
            { url: '/sitemap1.xml', sitemap: true },
            { url: '/sitemap2.xml', sitemap: true }
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
  
  describe('without base url setting', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.use(sitemap.index())
        .page(function(page) {
          page.site = new mock.Site();
          page.pages = [
            { url: '/hello' },
            { url: '/sitemap.xml', sitemap: true }
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