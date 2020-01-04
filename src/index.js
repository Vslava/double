const yargs = require('yargs');
const context = require('context');

const { commandHandlers } = context();

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
    handler: commandHandlers.collect,
  })
  .command({
    command: 'rescan',
    desc: 'Rescan all directories saved in the db',
    handler: commandHandlers.rescan,
  })
  .command({
    command: 'doubles [dirpath]',
    desc: 'Find doubles in the db',
    builder: (_yargs) => {
      _yargs.positional('dirpath', {
        describe: 'A directory where the files will be being found',
        type: 'string',
      });
    },
    handler: commandHandlers.doubles,
  })
  .command({
    command: 'purge',
    desc: 'Purge the absent file paths in the db',
    handler: commandHandlers.purge,
  })
  .command({
    command: 'just-scan [--show-doubles] <dirpath>',
    desc: 'Scan files in the specified directory. '
        + 'It shows the files having doubles in the db and without them',
    builder: (_yargs) => {
      _yargs.positional('dirpath', {
        describe: 'A directory where the files are being scanned',
        type: 'string',
      });
      _yargs.option('show-doubles', {
        describe: 'Show doubles for the files having them',
        type: 'boolean',
      });
    },
    handler: commandHandlers.justScan,
  })
  .scriptName('doubler')
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .recommendCommands()
  .help()
  .argv;
