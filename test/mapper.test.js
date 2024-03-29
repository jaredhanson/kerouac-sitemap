var chai = require('chai');
var sitemap = require('../lib');


describe('Mapper', function() {
  
  it('should request sitemap', function(done) {
    chai.kerouac.map(sitemap.createMapper())
      .close(function() {
        expect(this).to.request([ '/sitemap.xml' ]);
        expect(this.pages['/sitemap.xml'].locals).to.deep.equal({
          pages: []
        });
        done();
      })
      .generate();
  }); // should request sitemap
  
  it('should request sitemap index', function(done) {
    chai.kerouac.map(sitemap.createMapper({ index: true }))
      .close(function() {
        expect(this).to.request([ '/sitemap.xml', '/sitemap_index.xml' ]);
        expect(this.pages['/sitemap.xml'].locals).to.deep.equal({
          pages: []
        });
        expect(this.pages['/sitemap_index.xml'].locals).to.deep.equal({
          sitemaps: []
        });
        done();
      })
      .generate();
  }); // should request sitemap index
  
  it('should request sitemap index with specific name', function(done) {
    chai.kerouac.map(sitemap.createMapper({ index: 'sitemap-index.xml' }))
      .close(function() {
        expect(this).to.request([ '/sitemap.xml', '/sitemap-index.xml' ]);
        expect(this.pages['/sitemap.xml'].locals).to.deep.equal({
          pages: []
        });
        expect(this.pages['/sitemap-index.xml'].locals).to.deep.equal({
          sitemaps: []
        });
        done();
      })
      .generate();
  }); // should request sitemap index with specific name
  
  it('should set pages for sitemap', function(done) {
    chai.kerouac.map(sitemap.createMapper(), [
      { path: '/index.html' },
      { path: '/about.html' }
    ])
      .close(function() {
        expect(this).to.request([ '/sitemap.xml' ]);
        expect(this.pages['/sitemap.xml'].locals).to.deep.equal({
          pages: [
            { path: '/index.html' },
            { path: '/about.html' }
          ]
        });
        done();
      })
      .generate();
  }); // should set pages for sitemap
  
  it('should set sitemaps for sitemap index', function(done) {
    chai.kerouac.map(sitemap.createMapper({ index: true }), [
      { fullURL: 'http://www.example.com/sitemap.xml', isSitemap: true },
      { fullURL: 'http://www.example.com/blog/sitemap.xml', isSitemap: true }
    ])
      .close(function() {
        expect(this).to.request([ '/sitemap.xml', '/sitemap_index.xml' ]);
        expect(this.pages['/sitemap_index.xml'].locals).to.deep.equal({
          sitemaps: [
            { fullURL: 'http://www.example.com/sitemap.xml', isSitemap: true },
            { fullURL: 'http://www.example.com/blog/sitemap.xml', isSitemap: true }
          ]
        });
        done();
      })
      .generate();
  }); // should set pages for sitemap
  
});
