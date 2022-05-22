var events = require('events')
  , util = require('util');


function Mapper(options) {
  options = options || {};
  
  events.EventEmitter.call(this);
  this._index = options.index || false;
}

util.inherits(Mapper, events.EventEmitter);

Mapper.prototype.map = function(server) {
  var pages = []
    , sitemaps = [];
  
  server.on('request', function(page) {
    pages.push(page);
    
    if (page.sitemap) {
      sitemaps.push(page);
    }
  });
  
  
  this.request('/sitemap.xml', function(page) {
    page.locals = page.locals || Object.create(null);
    page.locals.pages = pages;
  });
  if (this._index) {
    this.request('/sitemap-index.xml', function(page) {
      page.locals = page.locals || Object.create(null);
      page.locals.sitemaps = sitemaps;
    });
  }
  this.emit('finish');
};

module.exports = Mapper;
