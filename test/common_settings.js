/* eslint-disable jest/require-top-level-describe */
/* eslint-disable jest/no-hooks */
const async = require('async');
const context = require('context');

require('./globals');

async function clearModelTables() {
  const ctx = context();
  const { _knex } = ctx.models;

  const modelNames = Object.keys(ctx.models);
  const modelTableNames = modelNames.map((modelName) => ctx.models[modelName].prototype.tableName);

  await async.eachSeries(modelTableNames, async (modelTableName) => (
    _knex(modelTableName).delete()
  ));
}

afterEach(async () => {
  await clearModelTables();
});
