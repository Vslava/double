/* global FILE_SIGNS */
/* global FILE_PATHS */
/* global DIRS */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { loggers } = appContext();
  const { File } = appContext().models;
  const { scanFiles } = appContext().commandHandlers;

  describe('without showing double files', () => {
    it('shows files from the db with and without doubles', async () => {
      expect.hasAssertions();

      // init
      const { dir1 } = DIRS;

      await new File({
        filepath: FILE_PATHS.file2,
        sign: FILE_SIGNS.file2,
      }).save();

      const loggerWoDoublesSpy = jest.spyOn(loggers, 'fileWoDoubles');
      const loggerWithDoublesSpy = jest.spyOn(loggers, 'fileWithDoubles');

      // process
      await scanFiles({ dirpath: dir1 });

      // check
      expect(loggerWithDoublesSpy).toHaveBeenCalledWith(FILE_PATHS.file2);

      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(FILE_PATHS['pic.png']);
      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(FILE_PATHS.file1);
    });
  });

  describe('with showing double files', () => {
    it('shows files from the db with and without doubles', async () => {
      expect.hasAssertions();

      // init
      const { dir1 } = DIRS;

      await new File({
        filepath: FILE_PATHS.file2,
        sign: FILE_SIGNS.file2,
      }).save();

      const loggerWoDoublesSpy = jest.spyOn(loggers, 'fileWoDoubles');
      const loggerWithDoublesSpy = jest.spyOn(loggers, 'fileWithDoubles');

      // process
      await scanFiles({ dirpath: dir1, 'show-doubles': true });

      // check
      expect(loggerWithDoublesSpy).toHaveBeenCalledWith(FILE_PATHS.file2, [FILE_PATHS.file2]);

      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(FILE_PATHS['pic.png']);
      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(FILE_PATHS.file1);
    });
  });
});
