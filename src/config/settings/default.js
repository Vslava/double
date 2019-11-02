const path = require('path');

module.exports = {
  db: {
    url: path.resolve(process.env.DATABASE_URL),
  },
};
