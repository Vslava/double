const async = require('async');
const context = require('context');

module.exports = async (options) => {
  const ctx = context();
  const { util } = ctx.services;
  const { File } = ctx.models;
  const { loggers } = options;

  const allFilesGenerator = await File.findAllGen();

  return async.eachSeries(allFilesGenerator, async (file) => {
    const { filepath } = file;

    console.log('---', filepath);

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
