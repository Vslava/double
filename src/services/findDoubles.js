const async = require('async');
const context = require('context');

module.exports = async ({ dirpath }, options) => {
  const { File } = context().models;
  const { logger } = options;

  const doublesStream = File.findDoublesInDirectoryStream(dirpath);

  await async.each(doublesStream, async (double) => {
    const {
      filepath: originFilePath,
      sign: fileSign,
    } = double;

    const doubleFilesForSign = await File.findAllForSign(fileSign);

    const doubleFilePathsForSign = doubleFilesForSign
      .map((doubleFile) => doubleFile.filepath)
      .filter((doubleFilePath) => doubleFilePath !== originFilePath);

    logger(originFilePath, doubleFilePathsForSign);
  });
};
