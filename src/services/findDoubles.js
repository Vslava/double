const async = require('async');
const context = require('context');

module.exports = async (options) => {
  const { File } = context().models;
  const { logger } = options;

  const doublesStream = File.findDoubleSigns().stream();

  await async.each(doublesStream, async (double) => {
    const { sign: fileSign } = double;

    const doubleFiles = await File.findAllForSign(fileSign);
    const doubleFilesPaths = doubleFiles.map((doubleFile) => doubleFile.get('filepath'));

    logger(doubleFilesPaths);
  });
};
