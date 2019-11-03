const async = require('async');
const context = require('context');

const { services } = context;

async function fileProcessor(filePath) {
  // TODO implement file processing
}

module.exports = ({ dirpaths }) => (
  async.each(dirpaths, async (dirpath) => (
    services.processDirectory({
      dirpath,
      fileProcessor,
    })
  ))
);
