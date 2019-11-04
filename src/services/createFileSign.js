const crypto = require('crypto');

module.exports = (resultBuffer) => (
  crypto.createHash('md5').update(resultBuffer).digest('hex')
);
