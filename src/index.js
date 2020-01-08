const yargs = require('yargs');
const context = require('context');

const { commandHandlers } = context();
const { handlerWrapper } = context().commandHandlers;

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
    handler: handlerWrapper(commandHandlers.collect),
  })
  .command({
    command: 'rescan',
    desc: 'Rescan all directories saved in the db',
    handler: handlerWrapper(commandHandlers.rescan),
  })
  .command({
    command: 'doubles [dirpath]',
    desc: 'Find doubles in the db',
    builder: (_yargs) => {
      _yargs.positional('dirpath', {
        describe: 'A directory to filter files only in it',
        type: 'string',
      });
    },
    handler: handlerWrapper(commandHandlers.doubles),
  })
  .command({
    command: 'purge',
    desc: 'Purge the absent file paths in the db',
    handler: handlerWrapper(commandHandlers.purge),
  })
  .command({
    command: 'scan-files [--show-doubles] <dirpath>',
    desc: 'Scan files in the specified directory and '
        + 'show the files with and without doubles in the db',
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
    handler: handlerWrapper(commandHandlers.scanFiles),
  })
  .command({
    command: 'remove-doubles <dirpath>',
    desc: 'Remove files in the specified directory which have doubles in the db',
    builder: (_yargs) => {
      _yargs.positional('dirpath', {
        describe: 'A directory where the files are being scanned',
        type: 'string',
      });
    },
    handler: handlerWrapper(commandHandlers.removeDoubles),
  })
  .scriptName('doubler')
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .recommendCommands()
  .help()
  .argv;
