const async = require('async');
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');

async function canProcessFile(filePath, { onlyImages }) {
  const fileReadStream = fs.createReadStream(filePath);
  const fileTypeStream = await fileType.stream(fileReadStream);

  const fileMimeType = (fileTypeStream.fileType || {}).mime;

  if (onlyImages) {
    return fileMimeType && fileMimeType.startsWith('image/');
  }

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

    if (!await canProcessFile(dirItemPath, { onlyImages })) {
      return null;
    }

    return fileProcessor && fileProcessor(dirItemPath);
  });
}

module.exports = processDirectory;
