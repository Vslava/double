const async = require('async');
const context = require('context');

module.exports = async (logger) => {
  const { File } = context().models;

  const doubles = await File.findDoubleSigns();

  await async.eachSeries(doubles, async (double) => {
    const { sign: fileSign } = double;

    const doubleFiles = await File.findAllForSign(fileSign);
    const doubleFilesPaths = doubleFiles.map((doubleFile) => doubleFile.get('filepath'));

    logger(doubleFilesPaths);
  });
};
