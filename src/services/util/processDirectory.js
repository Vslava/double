const async = require('async');
const fs = require('fs');
const path = require('path');

async function processDirectory({ dirpath, fileProcessor }) {
  const dirEntry = await fs.promises.opendir(dirpath);

  return async.eachSeries(dirEntry, async (dirItem) => {
    const nextDirItemPath = path.resolve(path.join(
      dirpath,
      dirItem.name,
    ));

    if (dirItem.isDirectory()) {
      return processDirectory({
        dirpath: nextDirItemPath,
        fileProcessor,
      });
    }

    return fileProcessor && fileProcessor(nextDirItemPath);
  });
}

module.exports = processDirectory;
