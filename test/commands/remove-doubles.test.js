/* global FILE_SIGNS */
/* global FILE_PATHS */
/* global DIRS */
const fs = require('fs');
const appContext = require('context');

describe(__filename, () => {
  const { File } = appContext().models;
  const { removeDoubles } = appContext().commandHandlers;

  it('removes files having doubles in the db', async () => {
    expect.hasAssertions();

    // init
    const { dir1 } = DIRS;

    await new File({
      filepath: FILE_PATHS.file1,
      sign: FILE_SIGNS.file1,
    }).save();

    await new File({
      filepath: FILE_PATHS.file2,
      sign: FILE_SIGNS.file2,
    }).save();

    const fsUnlinkMock = jest
      .spyOn(fs.promises, 'unlink')
      .mockImplementation(() => {});

    // process
    await removeDoubles({ dirpath: dir1 });

    // check
    expect(fsUnlinkMock).toHaveBeenCalledTimes(2);
    expect(fsUnlinkMock).toHaveBeenCalledWith(FILE_PATHS.file1);
    expect(fsUnlinkMock).toHaveBeenCalledWith(FILE_PATHS.file2);
  });
});
