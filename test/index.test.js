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
  
});
