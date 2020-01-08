/* global FIXTURE_DIR */
const fs = require('fs');
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { File } = appContext().models;
  const { removeDoubles } = appContext().commandHandlers;

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

  it('removes files having doubles in the db', async () => {
    expect.hasAssertions();

    // init
    const { dir1 } = setupDirs();
    const file1Path = path.join(dir1, 'file1');
    const file2Path = path.join(dir1, 'file2');

    await new File({
      filepath: file1Path,
      sign: fileSigns.file1,
    }).save();

    await new File({
      filepath: file2Path,
      sign: fileSigns.file2,
    }).save();

    const fsUnlinkMock = jest
      .spyOn(fs.promises, 'unlink')
      .mockImplementation(() => {});

    // process
    await removeDoubles({ dirpath: dir1 });

    // check
    expect(fsUnlinkMock).toHaveBeenCalledTimes(2);
    expect(fsUnlinkMock).toHaveBeenCalledWith(file1Path);
    expect(fsUnlinkMock).toHaveBeenCalledWith(file2Path);
  });
});
