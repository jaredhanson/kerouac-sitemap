var Browser = require('./browser');

exports = module.exports = require('./middleware/urlset');
exports.index = require('./middleware/sitemapindex');

exports.browser = function(options) {
  return new Browser(options);
};
