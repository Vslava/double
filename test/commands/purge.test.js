/* global FILE_SIGNS */
/* global FILE_PATHS */
/* global DIRS */
/* eslint-disable func-names */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { purge } = appContext().commandHandlers;
  const { File } = appContext().models;

  it('removes all absent files from the db', async () => {
    expect.hasAssertions();

    // init
    const { dir1 } = DIRS;

    const file1 = await new File({
      filepath: FILE_PATHS.file1,
      sign: FILE_SIGNS.file1,
    }).save();
    const file2 = await new File({
      filepath: FILE_PATHS.file2,
      sign: FILE_SIGNS.file2,
    }).save();

    const absentFile = await new File({
      filepath: path.join(dir1, 'file3'),
      sign: 'abcdef',
    }).save();

    // process
    await purge();

    // check
    const absentCount = await new File().where('id', absentFile.id).count();
    const existFiles = await new File().where('id', '<>', absentFile.id).fetchAll();
    const existFilesIds = existFiles.map((item) => item.id);

    expect(absentCount).toBe(0);
    expect(existFilesIds).toStrictEqual(expect.arrayContaining([file1.id, file2.id]));
  });
});
