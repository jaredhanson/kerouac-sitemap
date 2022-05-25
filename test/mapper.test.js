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
  
});
