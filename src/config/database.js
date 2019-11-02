const settings = require('./settings');

const config = {
  client: 'sqlite3',
  connection: {
    filename: settings.db.url,
  },
  migrations: {
    directory: './db/migrations'
  },
};

module.exports = config;
