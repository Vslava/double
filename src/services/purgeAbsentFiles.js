const async = require('async');
const fs = require('fs');
const context = require('context');

async function isFileExist(filePath) {
  const r = await fs.promises.access(filePath).catch((err) => err);
  return typeof r === 'undefined';
}

module.exports = async (options) => {
  const { logger } = options;
  const { File } = context().models;

  const allFilesStream = File.findAllKnex().stream();

  await async.each(allFilesStream, async (file) => {
    const filePath = file.filepath;
    const fileExist = await isFileExist(filePath);

    if (!fileExist) {
      await File.deleteById(file.id);
      logger(filePath);
    }
  });
};
