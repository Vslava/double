const async = require('async');
const context = require('context');

module.exports = async (options) => {
  const ctx = context();
  const { util } = ctx.services;
  const { File } = ctx.models;
  const { logger } = options;

  const allFilesStream = File.findAllKnex().stream();

  await async.each(allFilesStream, async (file) => {
    const filePath = file.filepath;
    const fileExist = await util.isFileExist(filePath);

    if (!fileExist) {
      await File.deleteById(file.id);
      logger(filePath);
    }
  });
};
