const async = require('async');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const context = require('context');

chai.use(chaiAsPromised);

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

after(() => process.exit(0));
