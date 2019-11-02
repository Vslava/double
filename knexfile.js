const database = require('./src/config/database');

module.exports = {
  development: database.development,
  test: database.test,
  production: database.production,
};
