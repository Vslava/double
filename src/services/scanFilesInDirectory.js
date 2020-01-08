/* eslint-disable no-lonely-if */
const context = require('context');

function showFileAndDoubles(filePath, doubles) {
  const { loggers } = context();

  const doubleFilePaths = doubles.map((double) => double.filepath);

  loggers.fileWithDoubles(
    filePath,
    doubleFilePaths,
  );
}

async function fileProcessor({ filePath, showDoubles }) {
  const { services, loggers } = context();
  const { File } = context().models;

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

module.exports = async ({ dirpath, showDoubles }) => {
  const { services } = context();

  await services.util.processDirectory({
    dirpath,
    fileProcessor: (filePath) => fileProcessor({ filePath, showDoubles }),
  });
};
