const path = require('path');
const settings = require('./settings');

const projectDir = path.resolve(__dirname, '..');

const config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(projectDir, settings.db.url),
  },
  migrations: {
    directory: path.join(projectDir, 'db/migrations'),
  },
  useNullAsDefault: true,
};

module.exports = config;
