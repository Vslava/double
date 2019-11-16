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
  const dirEntry = await fs.promises.opendir(dirpath);

  return async.eachSeries(dirEntry, async (dirItem) => {
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

    return fileProcessor && fileProcessor(dirItemPath);
  });
}

module.exports = processDirectory;
