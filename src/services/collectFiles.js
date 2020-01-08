const async = require('async');
const context = require('context');

async function fileExistInDb(filePath) {
  const { File } = context().models;

  const filesCount = await File.countByFilePath(filePath);

  return filesCount > 0;
}

async function saveInfoAboutFile(filePath) {
  const { services, loggers } = context();
  const { File } = context().models;

  const fileSign = await services.util.createFileSign(filePath);

  loggers.fileProcessed(filePath);

  await File.createNew({
    filepath: filePath,
    sign: fileSign,
  });

  return null;
}

async function fileProcessor(filePath) {
  const { loggers } = context();

  if (await fileExistInDb(filePath)) {
    loggers.fileAlreadyCollected(filePath);
    return null;
  }

  return saveInfoAboutFile(filePath);
}

module.exports = async ({ dirpaths, onlyImages }) => {
  const { services } = context();

  const fileAccessors = services.util.makeFileAccessorsList({ onlyImages });

  return async.eachSeries(dirpaths, async (dirpath) => (
    services.util.processDirectory({
      fileAccessors,
      dirpath,
      fileProcessor: (filePath) => fileProcessor(filePath),
    })
  ));
};
