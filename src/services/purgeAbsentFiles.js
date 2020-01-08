const async = require('async');
const context = require('context');

module.exports = async () => {
  const { loggers } = context();
  const { util } = context().services;
  const { File } = context().models;

  const allFilesStream = File.findAllStream();

  await async.each(allFilesStream, async (file) => {
    const filePath = file.filepath;
    const fileExist = await util.isFileExist(filePath);

    if (!fileExist) {
      await File.deleteById(file.id);
      loggers.purgedFile(filePath);
    }
  });
};
