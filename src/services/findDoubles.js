const async = require('async');
const context = require('context');

module.exports = async (logger) => {
  const { File } = context().models;

  const doubles = await File.query()
    .select('sign')
    .groupBy('sign')
    .havingRaw('COUNT(*) > 1');

  await async.eachSeries(doubles, async (double) => {
    const { sign: fileSign } = double;

    const doubleFiles = await File.where('sign', fileSign).fetchAll();
    const doubleFilesPaths = doubleFiles.map((doubleFile) => doubleFile.get('filepath'));

    logger(doubleFilesPaths);
  });
};
