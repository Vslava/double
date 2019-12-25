/* eslint-disable func-names */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { purgeAbsentFiles } = appContext().services;
  const { File } = appContext().models;

  const fileSigns = Object.freeze({
    file1: 'b6ee2058d98027764d589b1e3a102c39',
    file2: '6174e909453ef9d1658f95856eea4c97',
  });

  function setupDirs() {
    const rootDir = path.join(FIXTURE_DIR, 'several_dirs');

    return Object.freeze({
      dir1: path.join(rootDir, 'dir1'),
    });
  }

  it('removes all absent files', async () => {
    expect.hasAssertions();

    // init
    const { dir1 } = setupDirs();

    const logger = () => {};

    const file1 = await new File({
      filepath: path.join(dir1, 'file1'),
      sign: fileSigns.file1,
    }).save();
    const file2 = await new File({
      filepath: path.join(dir1, 'file2'),
      sign: fileSigns.file2,
    }).save();

    const absentFile = await new File({
      filepath: path.join(dir1, 'file3'),
      sign: 'abcdef',
    }).save();

    // process
    await purgeAbsentFiles({ logger });

    // check
    const absentCount = await new File().where('id', absentFile.id).count();
    const existFiles = await new File().where('id', '<>', absentFile.id).fetchAll();
    const existFilesIds = existFiles.map((item) => item.id);

    expect(absentCount).toBe(0);
    expect(existFilesIds).toStrictEqual(expect.arrayContaining([file1.id, file2.id]));
  });
});
