const _ = require('lodash');
const moduleExports = require('requireindex')(__dirname);

module.exports = (databaseConfig) => {
  const knex = require('knex')(databaseConfig);
  const bookshelf = require('bookshelf')(knex);

  return _.transform(moduleExports, (result, __, modelName) => {
    result[modelName] = moduleExports[modelName](bookshelf);
  }, {});
};
