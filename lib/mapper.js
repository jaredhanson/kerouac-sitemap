var events = require('events')
  , util = require('util');


function Mapper(options) {
  options = options || {};
  
  events.EventEmitter.call(this);
  this._index = options.index == true ? 'sitemap_index.xml' : options.index;
}

util.inherits(Mapper, events.EventEmitter);

Mapper.prototype.map = function(server) {
  var self = this
    , pages = []
    , sitemaps = [];
  
  server.on('request', function(page) {
    pages.push(page);
    if (page.isSitemap) {
      sitemaps.push(page);
    }
  });
  
  
  this.wait = true;
  
  server.once('finish', function() {
    self.request('/sitemap.xml', function(page) {
      page.locals = page.locals || Object.create(null);
      page.locals.pages = pages;
    });
    if (self._index) {
      self.request('/' + self._index, function(page) {
        page.locals = page.locals || Object.create(null);
        page.locals.sitemaps = sitemaps;
      });
    }
    
    self.end();
  });
};

module.exports = Mapper;
