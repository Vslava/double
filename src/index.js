const _ = require('lodash');
const yargs = require('yargs');
const context = require('context');

async function defaultHandler(handler) {
  await handler();

  process.exit(0);
}

async function collectHandler(argv) {
  const { loggers } = context();

  const collectLoggers = _.pick(loggers, [
    'fileAlreadyCollected',
    'fileProcessed',
  ]);

  await defaultHandler(() => (
    context().services.collectFiles({
      onlyImages: !!argv['only-images'],
      dirpaths: [
        argv.dirpath,
      ],
    }, {
      loggers: collectLoggers,
    })
  ), argv);
}

async function doublesHandler(argv) {
  const { loggers } = context();

  await defaultHandler(() => (
    context().services.findDoubles({ logger: loggers.doubleFiles })
  ), argv);
}

async function purgeHandler(argv) {
  const { loggers } = context();

  await defaultHandler(() => (
    context().services.purgeAbsentFiles({ logger: loggers.purgedFile })
  ), argv);
}

// eslint-disable-next-line no-unused-expressions
yargs
  .command({
    command: 'collect [--only-images] <dirpath>',
    desc: 'Collect information about all files in the dirpath directory',
    builder: (_yargs) => {
      _yargs.positional('dirname', {
        describe: 'A directory where the files are placed',
        type: 'string',
      });
      _yargs.option('only-images', {
        describe: 'Only images will be processed',
        type: 'boolean',
      });
    },
    handler: collectHandler,
  })
  .command({
    command: 'doubles',
    desc: 'Find doubles in the db',
    handler: doublesHandler,
  })
  .command({
    command: 'purge',
    desc: 'Purge the absent file paths in the db',
    handler: purgeHandler,
  })
  .scriptName('doubler-js')
  .strict()
  .demandCommand(1, 'You need at least one command before moving on')
  .recommendCommands()
  .help()
  .argv;
