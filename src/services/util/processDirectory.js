const async = require('async');
const fs = require('fs');
const path = require('path');

function canProcessFile(filePath) {
  // TODO check the mime-type of the file
  return true;
}

async function processDirectory({ dirpath, onlyImages, fileProcessor }) {
  const dirEntry = await fs.promises.opendir(dirpath);

  return async.eachSeries(dirEntry, async (dirItem) => {
    const dirItemPath = path.resolve(path.join(
      dirpath,
      dirItem.name,
    ));

    if (dirItem.isDirectory()) {
      return processDirectory({
        dirpath: dirItemPath,
        onlyImages,
        fileProcessor,
      });
    }

    if (!canProcessFile(dirItemPath)) {
      return null;
    }

    return fileProcessor && fileProcessor(dirItemPath);
  });
}

module.exports = processDirectory;
