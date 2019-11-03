const async = require('async');
const fs = require('fs');
const util = require('util');
const context = require('context');

const fsOpen = util.promisify(fs.open);
const fsRead = util.promisify(fs.read);

const START_FILE_BYTES_COUNT = 2000000;

async function readFileBeginning(filePath) {
  const fid = await fsOpen(filePath);

  const buf = Buffer.alloc(START_FILE_BYTES_COUNT);

  const { buffer } = await fsRead(fid, buf, 0, START_FILE_BYTES_COUNT, 0);

  return buffer;
}
async function fileProcessor(filePath) {
  // TODO implement file processing
}

module.exports = async ({ dirpaths }) => (
  async.each(dirpaths, async (dirpath) => {
    const { services } = context();

    return services.processDirectory({
      dirpath,
      fileProcessor,
    });
  })
);
