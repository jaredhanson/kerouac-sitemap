var events = require('events')
  , util = require('util');


function Browser(options) {
  options = options || {};
  
  events.EventEmitter.call(this);
  this._index = options.index || false;
}

util.inherits(Browser, events.EventEmitter);

Browser.prototype.map = function() {
  this.request('/sitemap.xml');
  if (this._index) { this.request('/sitemap-index.xml'); }
  this.emit('finish');
};


module.exports = Browser;
