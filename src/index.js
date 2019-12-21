const yargs = require('yargs');
const context = require('context');

const { loggers } = context();

// eslint-disable-next-line no-unused-expressions
yargs
  .command({
    command: 'collect [--only-images] <dirpath>',
    desc: 'Collect information about all files in the dirpath directory',
    builder: (_yargs) => {
      _yargs.positional('dirpath', {
        describe: 'A directory where the files are placed',
        type: 'string',
      });
      _yargs.option('only-images', {
        describe: 'Only images will be processed',
        type: 'boolean',
      });
    },
    handler: context().commandHandlers.collect,
  })
  .command({
    command: 'doubles',
    desc: 'Find doubles in the db',
    handler: context().commandHandlers.doubles,
  })
  .command({
    command: 'purge',
    desc: 'Purge the absent file paths in the db',
    handler: context().commandHandlers.purge,
  })
  .scriptName('doubler-js')
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .recommendCommands()
  .help()
  .argv;
