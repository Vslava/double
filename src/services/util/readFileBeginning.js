const fs = require('fs');
const util = require('util');

const fsOpen = util.promisify(fs.open);
const fsRead = util.promisify(fs.read);

const START_FILE_BYTES_COUNT = 2000000;

module.exports = async (filePath) => {
  const fid = await fsOpen(filePath, 'r');

  const buf = Buffer.alloc(START_FILE_BYTES_COUNT);

  const { buffer } = await fsRead(fid, buf, 0, START_FILE_BYTES_COUNT, 0);

  return buffer;
};
