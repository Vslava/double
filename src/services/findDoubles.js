const async = require('async');
const context = require('context');

module.exports = async ({ dirpath }) => {
  const { loggers } = context();
  const { File } = context().models;

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

    loggers.doubleFiles(originFilePath, doubleFilePathsForSign);
  });
};
