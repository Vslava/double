const async = require('async');
const context = require('context');

async function fileExistInDb(filePath) {
  const { File } = context().models;

  const result = await File
    .where('filepath', filePath)
    .fetch({ require: false });

  return !!result;
}

async function saveInfoAboutFile(filePath, options) {
  const ctx = context();
  const { services } = ctx;
  const { File } = ctx.models;
  const { loggers } = options;

  const fileBuffer = await services.util.readFileBeginning(filePath);
  const fileSign = await services.util.createFileSign(fileBuffer);

  loggers.fileProcessed(filePath);

  await new File({
    filepath: filePath,
    sign: fileSign,
  }).save();

  return null;
}

async function fileProcessor(filePath, options) {
  const { loggers } = options;

  if (await fileExistInDb(filePath)) {
    loggers.fileAlreadyCollected(filePath);
    return null;
  }

  return saveInfoAboutFile(filePath, options);
}

module.exports = async ({ dirpaths, onlyImages }, options) => {
  const { services } = context();

  const fileAccessors = services.util.makeFileAccessorsList({ onlyImages });

  return async.eachSeries(dirpaths, async (dirpath) => (
    services.util.processDirectory({
      fileAccessors,
      dirpath,
      fileProcessor: (filePath) => fileProcessor(filePath, options),
    })
  ));
};
