const async = require('async');
const context = require('context');

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
