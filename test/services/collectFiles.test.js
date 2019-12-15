/* eslint-disable func-names */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  function checkFunction(cachedFiles) {
    return (dir, fileName) => {
      const findFile = (filep) => cachedFiles.toArray().filter(
        (fileInfo) => (fileInfo.get('filepath') === filep),
      );

      return findFile(path.join(dir, fileName))[0].get('sign');
    };
  }

  const fileSigns = {
    file1: 'b6ee2058d98027764d589b1e3a102c39',
    file2: '6174e909453ef9d1658f95856eea4c97',
    'pic.png': '006321de634e21d0ba7ac4557e515887',
    file3: '02a73a746f187bbdee14bcf8b752d643',
    file4: '2241b4b34e81a6d0829e944f89a35d1e',
    'pic.jpeg': '7a86539287b66fcb477a754f7f861f6a',
    thesame1: 'b6ee2058d98027764d589b1e3a102c39',
  };

  const options = {
    loggers: {
      fileAlreadyCollected: () => {},
      fileProcessed: () => {},
    },
  };

  function setupDirs() {
    const rootDir = path.join(FIXTURE_DIR, 'several_dirs');

    return {
      dir1: path.join(rootDir, 'dir1'),
      dir2: path.join(rootDir, 'dir2'),
      theSame: path.join(rootDir, 'the_same'),
    }
  }

  describe('process all files', () => {
    it('collect all files of the directories into the db', async () => {
      expect.hasAssertions();

      // init
      const { dir1, dir2 } = setupDirs();

      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      // process
      await collectFiles({
        dirpaths: [dir1, dir2],
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(cachedFiles).toHaveLength(6);
      expect(checkSign(dir1, 'file1')).toBe(fileSigns.file1);
      expect(checkSign(dir1, 'file2')).toBe( fileSigns.file2);
      expect(checkSign(dir1, 'pic.png')).toBe(fileSigns['pic.png']);
      expect(checkSign(dir2, 'file3')).toBe(fileSigns.file3);
      expect(checkSign(dir2, 'file4')).toBe(fileSigns.file4);
      expect(checkSign(dir2, 'pic.jpeg')).toBe(fileSigns['pic.jpeg']);
    });
  });

  describe('process only images', () => {
    it('only collects image files from the directories into the db', async () => {
      expect.hasAssertions();

      // init
      const { dir1, dir2 } = setupDirs();

      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      // process
      await collectFiles({
        dirpaths: [dir1, dir2],
        onlyImages: true,
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(cachedFiles).toHaveLength(2);
      expect(checkSign(dir1, 'pic.png')).toBe(fileSigns['pic.png']);
      expect(checkSign(dir2, 'pic.jpeg')).toBe(fileSigns['pic.jpeg']);
    });
  });

  describe('if some of the files were already collected', () => {
    it('ignores these files during file processing', async () => {
      expect.hasAssertions();

      // init
      const { dir1, dir2 } = setupDirs();

      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      await new File({
        filepath: path.join(dir1, 'file1'),
        sign: fileSigns.file1,
      }).save();
      await new File({
        filepath: path.join(dir2, 'file3'),
        sign: fileSigns.file3,
      }).save();

      // process
      await collectFiles({
        dirpaths: [dir1, dir2],
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(cachedFiles).toHaveLength(6);
      expect(checkSign(dir1, 'file1')).toBe(fileSigns.file1);
      expect(checkSign(dir1, 'file2')).toBe(fileSigns.file2);
      expect(checkSign(dir1, 'pic.png')).toBe(fileSigns['pic.png']);
      expect(checkSign(dir2, 'file3')).toBe(fileSigns.file3);
      expect(checkSign(dir2, 'file4')).toBe(fileSigns.file4);
      expect(checkSign(dir2, 'pic.jpeg')).toBe(fileSigns['pic.jpeg']);
    });
  });

  describe('when there is a file with the same sign', () => {
    it('collects it everyway', async () => {
      expect.hasAssertions();

      // init
      const { dir1, theSame } = setupDirs();

      const { collectFiles } = appContext().services;
      const { File } = appContext().models;

      // process
      await collectFiles({
        dirpaths: [dir1, theSame],
      }, options);

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(checkSign(dir1, 'file1')).toBe(fileSigns.file1);
      expect(checkSign(theSame, 'thesame1')).toBe(fileSigns.thesame1);
    });
  });
});
