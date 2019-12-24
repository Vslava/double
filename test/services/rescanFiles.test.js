const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { File } = appContext().models;
  const { rescanFiles } = appContext().services;

  const fileSigns = {
    file1: 'b6ee2058d98027764d589b1e3a102c39',
    file2: '6174e909453ef9d1658f95856eea4c97',
  };

  const options = {
    loggers: {
      fileAbsent: jest.fn(),
      fileRescanned: jest.fn(),
    },
  };

  function setupDirs() {
    const rootDir = path.join(FIXTURE_DIR, 'several_dirs');

    return {
      dir1: path.join(rootDir, 'dir1'),
    }
  }

  it('creates a new sign for the file', async () => {
    expect.hasAssertions();

    // init
    const { dir1 } = setupDirs();
    const file2Path = path.join(dir1, 'file2');

    await new File({
      filepath: path.join(dir1, 'file1'),
      sign: fileSigns.file1,
    }).save();
    const rescanFile = await new File({
      filepath: file2Path,
      sign: 'fakesign',
    }).save();

    // process
    await rescanFiles(options);

    // check
    await rescanFile.refresh();

    expect(rescanFile.get('sign')).toBe(fileSigns.file2);
    expect(options.loggers.fileRescanned).toHaveBeenCalledWith(file2Path);
  });

  describe('when the file in the db is absent', () => {
    it('shows a message about absence', async () => {
      expect.hasAssertions();

      // init
      const { dir1 } = setupDirs();
      const fakeFilePath = path.join(dir1, 'fakeFile');

      await new File({
        filepath: path.join(dir1, 'file1'),
        sign: fileSigns.file1,
      }).save();
      const rescanFile = await new File({
        filepath: fakeFilePath,
        sign: fileSigns.file2,
      }).save();

      // process
      await rescanFiles(options);

      // check
      expect(options.loggers.fileAbsent).toHaveBeenCalledWith(fakeFilePath);
    });
  });
});
