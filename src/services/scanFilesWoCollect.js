/* eslint-disable no-lonely-if */
const context = require('context');

function showFileAndDoubles(filePath, doubles, loggers) {
  const doubleFilePaths = doubles.map((double) => double.filepath);

  loggers.fileWithDoubles(
    filePath,
    doubleFilePaths,
  );
}

async function fileProcessor({ filePath, showDoubles }, options) {
  const { services } = context();
  const { File } = context().models;

  const { loggers } = options;

  const fileSign = await services.util.createFileSign(filePath);

  const foundDoubles = await File.findAllForSign(fileSign);

  if (foundDoubles.length === 0) {
    loggers.fileWoDoubles(filePath);
  } else {
    if (showDoubles) {
      showFileAndDoubles(filePath, foundDoubles, loggers);
    } else {
      loggers.fileWithDoubles(filePath);
    }
  }
}

module.exports = async ({ dirpath, showDoubles }, options) => {
  const { services } = context();

  await services.util.processDirectory({
    dirpath,
    fileProcessor: (filePath) => fileProcessor({ filePath, showDoubles }, options),
  });
};
