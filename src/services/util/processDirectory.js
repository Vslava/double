const async = require('async');
const fs = require('fs');
const path = require('path');

async function canProcessFile(filePath, fileAccessors) {
  if (fileAccessors.length === 0) {
    return true;
  }

  return async.reduce((fileAccessors), false, async (memo, fileAccessor) => {
    const checkResult = await fileAccessor(filePath);

    return memo || checkResult;
  });
}

async function processDirectory({ dirpath, fileAccessors, fileProcessor }) {
  const dirItems = await fs.promises.opendir(dirpath);

  await async.eachSeries(dirItems, async (dirItem) => {
    const dirItemPath = path.resolve(path.join(
      dirpath,
      dirItem.name,
    ));

    if (dirItem.isDirectory()) {
      return processDirectory({
        dirpath: dirItemPath,
        fileAccessors,
        fileProcessor,
      });
    }

    if (!await canProcessFile(dirItemPath, fileAccessors)) {
      return null;
    }

    return fileProcessor
      ? fileProcessor(dirItemPath)
      : null;
  });
}

module.exports = processDirectory;
