const _ = require('lodash');
const knexModule = require('knex');
const bookshelfModule = require('bookshelf');

const moduleExports = require('requireindex')(__dirname);

module.exports = (databaseConfig) => {
  const knex = knexModule(databaseConfig);
  const bookshelf = bookshelfModule(knex);

  const loadedModels = _.transform(moduleExports, (result, __, modelName) => {
    result[modelName] = moduleExports[modelName](bookshelf);
  }, {});

  const result = {
    ...loadedModels,
    _knex: knex,
    _bookshelf: bookshelf,
  };

  Object.defineProperties(result, {
    _knex: {
      enumerable: false,
    },
    _bookshelf: {
      enumerable: false,
    },
  });

  return result;
};
