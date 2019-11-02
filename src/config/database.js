const settings = require('./settings');

const commonConfig = {
  client: 'sqlite3',
  connection: {
    filename: settings.db.url,
  },
  migrations: {
    directory: './db/migrations'
  },
};

module.exports = {
  development: commonConfig,
  test: commonConfig,
  production: commonConfig,
};
