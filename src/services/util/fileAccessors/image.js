const fs = require('fs');
const fileType = require('file-type');

module.exports = async (filePath) => {
  const fileReadStream = fs.createReadStream(filePath);
  const fileTypeStream = await fileType.stream(fileReadStream);

  const fileMimeType = (fileTypeStream.fileType || {}).mime;

  return fileMimeType && fileMimeType.startsWith('image/');
};
