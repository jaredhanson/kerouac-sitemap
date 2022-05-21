var Mapper = require('./mapper');

exports = module.exports = require('./middleware/urlset');
exports.index = require('./middleware/sitemapindex');

exports.createMapper = function(options) {
  return new Mapper(options);
};
