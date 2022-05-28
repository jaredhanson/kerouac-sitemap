var chai = require('chai');
var sitemap = require('../lib');


describe('Mapper', function() {
  
  it('should request sitemap', function(done) {
    chai.kerouac.map(sitemap.createMapper())
      .close(function() {
        expect(this).to.request([ '/sitemap.xml' ]);
        expect(this.pages['/sitemap.xml'].locals).to.deep.equal({
          pages: []
        })
        done();
      })
      .generate();
  }); // should request sitemap
  
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
        })
        done();
      })
      .generate();
  }); // should set pages for sitemap
  
});
