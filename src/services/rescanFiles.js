const async = require('async');
const context = require('context');

module.exports = async () => {
  const { loggers } = context();
  const { util } = context().services;
  const { File } = context().models;

  const allFilesGenerator = await File.findAllGen();

  return async.eachSeries(allFilesGenerator, async (file) => {
    const { filepath } = file;

    if (await util.isFileExist(filepath)) {
      const fileSign = await util.createFileSign(filepath);

      if (file.sign !== fileSign) {
        process.stdout.write('\n');
        loggers.fileRescanned(filepath);

        await File.update(file.id, { sign: fileSign });
      }
    } else {
      process.stdout.write('\n');
      loggers.fileAbsent(filepath);
    }
  });
};
