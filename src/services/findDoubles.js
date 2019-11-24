const async = require('async');
const context = require('context');

async function fileProcessor(filePath) {
  const ctx = context();
  const { services } = ctx;
  const { File } = ctx.models;

  const fileBuffer = await services.util.readFileBeginning(filePath);
  const fileSign = await services.util.createFileSign(fileBuffer);

  const doublers = await File.where('sign', fileSign).fetchAll({ require: false });

  if (doublers) {
    console.log(`--- file: ${filePath} ---`);
    doublers.forEach((doubler) => {
      console.log(`    has a double: ${doubler.get('filepath')}`);
    });
    console.log('\n');
  }
}

module.exports = async ({ dirpaths, onlyImages }) => {
  const { services } = context();

  const fileAccessors = services.util.makeFileAccessorsList({ onlyImages });

  return async.eachSeries(dirpaths, async (dirpath) => (
    services.util.processDirectory({
      fileAccessors,
      dirpath,
      fileProcessor,
    })
  ));
};
