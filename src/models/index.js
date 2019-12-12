const _ = require('lodash');
const knexModule = require('knex');
const bookshelfModule = require('bookshelf');

const moduleExports = require('requireindex')(__dirname);

function initializeModule(databaseConfig) {
  const knex = knexModule(databaseConfig);
  const bookshelf = bookshelfModule(knex);

  const loadedModels = _.transform(moduleExports, (rslt, __, modelName) => {
    // eslint-disable-next-line no-param-reassign
    rslt[modelName] = moduleExports[modelName](bookshelf);
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
}

let result;

module.exports = (databaseConfig) => {
  if (!result) {
    result = initializeModule(databaseConfig);
  }

  return result;
};
