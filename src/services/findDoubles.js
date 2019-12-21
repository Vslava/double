const async = require('async');
const context = require('context');

module.exports = async (options) => {
  const { File } = context().models;
  const { logger } = options;

  const doublesStream = File.findDoublesKnex().stream();

  await async.each(doublesStream, async (double) => {
    const {
      filepath: originFilePath,
      sign: fileSign
    } = double;

    const doubleFiles = await File.findAllForSign(fileSign);

    const doubleFilePaths = doubleFiles
      .map((doubleFile) => doubleFile.get('filepath'))
      .filter((doubleFilePath) => doubleFilePath !== originFilePath);

    logger(originFilePath, doubleFilePaths);
  });
};
