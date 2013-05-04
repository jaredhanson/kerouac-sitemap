var sitemap = require('index');

function MockSite() {
  this.settings = {};
  this.pages = {};
}

MockSite.prototype.get =
MockSite.prototype.set = function(setting, val) {
  if (1 == arguments.length) {
    return this.settings[setting];
  } else {
    this.settings[setting] = val;
    return this;
  }
}

MockSite.prototype.page = function(path, fn) {
  this.pages[path] = new MockPage(path, fn);
}

function MockPage(path, fn) {
  this.path = path;
  this.fn = fn;
  this.data = '';
}

MockPage.prototype.write = function(data) {
  this.data += data;
}


describe('sitemap plugin', function() {
  
  it('should export function', function() {
    expect(sitemap).to.be.a('function');
  });
  
  describe('when invoked on a site with two pages', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    site.page('/hello.html', function(){});
    site.page('/company/contact.html', function(){});
    
    sitemap()(site, site.pages);
    
    it('should add /sitemap.xml page', function() {
      expect(site.pages).to.include.keys('/sitemap.xml');
    });
    
    describe('and then rendering sitemap.xml', function() {
      var p = site.pages['/sitemap.xml'];

      it('should write .htaccess', function(done) {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/company/contact.html</loc>',
          '  </url>',
          '  <url>',
          '    <loc>http://www.example.com/hello.html</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked on a site with a robots.txt file', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    site.page('/hello.html', function(){});
    site.page('/robots.txt', function(){});
    
    sitemap()(site, site.pages);
    
    it('should add /sitemap.xml page', function() {
      expect(site.pages).to.include.keys('/sitemap.xml');
    });
    
    describe('and then rendering sitemap.xml', function() {
      var p = site.pages['/sitemap.xml'];

      it('should write .htaccess', function(done) {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.html</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked on a site with CSS and JavaScript', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    site.page('/hello.html', function(){});
    site.page('/css/site.css', function(){});
    site.page('/js/main.js', function(){});
    
    sitemap()(site, site.pages);
    
    it('should add /sitemap.xml page', function() {
      expect(site.pages).to.include.keys('/sitemap.xml');
    });
    
    describe('and then rendering sitemap.xml', function() {
      var p = site.pages['/sitemap.xml'];

      it('should write .htaccess', function(done) {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.html</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked on a site with multiple sitemaps', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    site.page('/hello.html', function(){});
    site.page('/sitemap2.xml', function(){});
    site.pages['/sitemap2.xml'].sitemap = true;
    
    sitemap()(site, site.pages);
    
    it('should add /sitemap.xml page', function() {
      expect(site.pages).to.include.keys('/sitemap.xml');
    });
    
    describe('and then rendering sitemap.xml', function() {
      var p = site.pages['/sitemap.xml'];

      it('should write .htaccess', function(done) {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          '    <loc>http://www.example.com/hello.html</loc>',
          '  </url>',
          '</urlset>',
          ''
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked on a site without base url setting', function() {
    var site = new MockSite();
    
    it('should throw an error', function() {
      expect(function() {
        sitemap()(site, site.pages);
      }).to.throw(/requires \"base url\" setting/);
    });
  });
  
});
