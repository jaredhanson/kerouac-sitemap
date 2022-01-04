var events = require('events')
  , util = require('util');


function Browser() {
  events.EventEmitter.call(this);
}

util.inherits(Browser, events.EventEmitter);

Browser.prototype.start = function() {
  this.request('/sitemap.xml');
  this.request('/sitemap-index.xml');
  this.emit('finish');
};


module.exports = Browser;
