const fs = require('fs');
const context = require('context');

async function fileProcessor(filePath) {
  const { services, loggers } = context();
  const { File } = context().models;

  const fileSign = await services.util.createFileSign(filePath);

  const foundDoubles = await File.findAllForSign(fileSign);

  if (foundDoubles.length > 0) {
    loggers.fileRemoved(filePath);
    await fs.promises.unlink(filePath);
  }
}

module.exports = async ({ dirpath }) => {
  const { services } = context();

  return services.util.processDirectory({
    dirpath,
    fileProcessor: (filePath) => fileProcessor(filePath),
  });
};
