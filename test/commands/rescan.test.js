/* global FILE_SIGNS */
/* global FILE_PATHS */
/* global DIRS */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { loggers } = appContext();
  const { File } = appContext().models;
  const { rescan } = appContext().commandHandlers;

  it('updates the sign for the file', async () => {
    expect.hasAssertions();

    // init
    await new File({
      filepath: FILE_PATHS.file1,
      sign: FILE_SIGNS.file1,
    }).save();

    const rescanFile = await new File({
      filepath: FILE_PATHS.file2,
      sign: 'fakesign',
    }).save();

    const loggerSpy = jest.spyOn(loggers, 'fileRescanned');

    // process
    await rescan();

    // check
    await rescanFile.refresh();

    expect(rescanFile.get('sign')).toBe(FILE_SIGNS.file2);
    expect(loggerSpy).toHaveBeenCalledWith(FILE_PATHS.file2);
  });

  describe('when the file in the db is absent', () => {
    it('shows a message about absence', async () => {
      expect.hasAssertions();

      // init
      const { dir1 } = DIRS;
      const fakeFilePath = path.join(dir1, 'fakeFile');

      await new File({
        filepath: FILE_PATHS.file1,
        sign: FILE_SIGNS.file1,
      }).save();
      await new File({
        filepath: fakeFilePath,
        sign: FILE_SIGNS.file2,
      }).save();

      const loggerSpy = jest.spyOn(loggers, 'fileAbsent');

      // process
      await rescan();

      // check
      expect(loggerSpy).toHaveBeenCalledWith(fakeFilePath);
    });
  });
});
