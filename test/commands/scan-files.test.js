/* global FIXTURE_DIR */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { loggers } = appContext();
  const { File } = appContext().models;
  const { scanFiles } = appContext().commandHandlers;

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

  describe('without showing double files', () => {
    it('shows files from the db with and without doubles', async () => {
      expect.hasAssertions();

      // init
      const { dir1 } = setupDirs();
      const file1Path = path.join(dir1, 'file1');
      const file2Path = path.join(dir1, 'file2');
      const imagePath = path.join(dir1, 'pic.png');

      await new File({
        filepath: file2Path,
        sign: fileSigns.file2,
      }).save();

      const loggerWoDoublesSpy = jest.spyOn(loggers, 'fileWoDoubles');
      const loggerWithDoublesSpy = jest.spyOn(loggers, 'fileWithDoubles');

      // process
      await scanFiles({ dirpath: dir1 });

      // check
      expect(loggerWithDoublesSpy).toHaveBeenCalledWith(file2Path);

      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(imagePath);
      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(file1Path);
    });
  });

  describe('with showing double files', () => {
    it('shows files from the db with and without doubles', async () => {
      expect.hasAssertions();

      // init
      const { dir1 } = setupDirs();
      const file1Path = path.join(dir1, 'file1');
      const file2Path = path.join(dir1, 'file2');
      const imagePath = path.join(dir1, 'pic.png');

      await new File({
        filepath: file2Path,
        sign: fileSigns.file2,
      }).save();

      const loggerWoDoublesSpy = jest.spyOn(loggers, 'fileWoDoubles');
      const loggerWithDoublesSpy = jest.spyOn(loggers, 'fileWithDoubles');

      // process
      await scanFiles({ dirpath: dir1, 'show-doubles': true });

      // check
      expect(loggerWithDoublesSpy).toHaveBeenCalledWith(file2Path, [file2Path]);

      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(imagePath);
      expect(loggerWoDoublesSpy).toHaveBeenCalledWith(file1Path);
    });
  });
});
