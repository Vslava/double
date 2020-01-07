const fs = require('fs');
const context = require('context');

async function fileProcessor(filePath, options) {
  const { services } = context();
  const { File } = context().models;

  const { logger } = options;

  const fileSign = await services.util.createFileSign(filePath);

  const foundDoubles = await File.findAllForSign(fileSign);

  if (foundDoubles.length > 0) {
    logger(filePath);
    await fs.promises.unlink(filePath);
  }
}

module.exports = async ({ dirpath }, options) => {
  const { services } = context();

  return services.util.processDirectory({
    dirpath,
    fileProcessor: (filePath) => fileProcessor(filePath, options),
  });
};
