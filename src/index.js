const yargs = require('yargs');
const context = require('context');

async function defaultHandler(handler) {
  await handler();

  process.exit(0);
}

const commonOptions = (_yargs) => {
  _yargs.positional('dirname', {
    describe: 'A directory where the files are placed',
    type: 'string',
  });
  _yargs.option('only-images', {
    describe: 'Only images will be processed',
    type: 'boolean',
  });
};

// eslint-disable-next-line no-unused-expressions
yargs
  .command({
    command: 'collect [--only-images] <dirpath>',
    desc: 'Collect information about all files in the dirpath directory',
    builder: commonOptions,
    handler: async (argv) => {
      await defaultHandler(() => (
        context().services.collectFiles({
          onlyImages: !!argv['only-images'],
          dirpaths: [
            argv.dirpath,
          ],
        })
      ), argv);
    },
  })
  .command({
    command: 'find [--only-images] <dirpath>',
    desc: 'Find doubles in the db for all files in the dirpath directory',
    builder: commonOptions,
    handler: async (argv) => {
      await defaultHandler(() => (
        context().services.findDoubles({
          onlyImages: !!argv['only-images'],
          dirpaths: [
            argv.dirpath,
          ],
        })
      ), argv);
    },
  })
  .scriptName('doubler')
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .recommendCommands()
  .help()
  .argv;
