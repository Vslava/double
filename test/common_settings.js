/* eslint-disable func-names */
const path = require('path');
const async = require('async');
const sinon = require('sinon');
const context = require('context');

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
  sinon.restore();

  await clearModelTables();
});

before(function () {
  this.fixtureDir = path.resolve('test/fixtures');
});

after(() => process.exit(0));
