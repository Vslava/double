/* global FILE_SIGNS */
/* global FILE_PATHS */
/* global DIRS */
/* eslint-disable func-names */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { collect } = appContext().commandHandlers;
  const { File } = appContext().models;

  function checkFunction(cachedFiles) {
    return (dir, fileName) => {
      const findFile = (filep) => cachedFiles.toArray().filter(
        (fileInfo) => (fileInfo.get('filepath') === filep),
      );

      return findFile(path.join(dir, fileName))[0].get('sign');
    };
  }

  describe('process all files', () => {
    it('collect all files of the directories into the db', async () => {
      expect.hasAssertions();

      // init
      const { dir1, dir2 } = DIRS;

      // process
      await collect({ dirpath: dir1 });
      await collect({ dirpath: dir2 });

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(cachedFiles).toHaveLength(6);
      expect(checkSign(dir1, 'file1')).toBe(FILE_SIGNS.file1);
      expect(checkSign(dir1, 'file2')).toBe(FILE_SIGNS.file2);
      expect(checkSign(dir1, 'pic.png')).toBe(FILE_SIGNS['pic.png']);
      expect(checkSign(dir2, 'file3')).toBe(FILE_SIGNS.file3);
      expect(checkSign(dir2, 'file4')).toBe(FILE_SIGNS.file4);
      expect(checkSign(dir2, 'pic.jpeg')).toBe(FILE_SIGNS['pic.jpeg']);
    });
  });

  describe('process only images', () => {
    it('only collects image files from the directories into the db', async () => {
      expect.hasAssertions();

      // init
      const { dir1, dir2 } = DIRS;

      // process
      await collect({ dirpath: dir1, 'only-images': true });
      await collect({ dirpath: dir2, 'only-images': true });

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(cachedFiles).toHaveLength(2);
      expect(checkSign(dir1, 'pic.png')).toBe(FILE_SIGNS['pic.png']);
      expect(checkSign(dir2, 'pic.jpeg')).toBe(FILE_SIGNS['pic.jpeg']);
    });
  });

  describe('if some of the files were already collected', () => {
    it('ignores these files during file processing', async () => {
      expect.hasAssertions();

      // init
      const { dir1, dir2 } = DIRS;

      await new File({
        filepath: FILE_PATHS.file1,
        sign: FILE_SIGNS.file1,
      }).save();
      await new File({
        filepath: FILE_PATHS.file3,
        sign: FILE_SIGNS.file3,
      }).save();

      // process
      await collect({ dirpath: dir1 });
      await collect({ dirpath: dir2 });

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(cachedFiles).toHaveLength(6);
      expect(checkSign(dir1, 'file1')).toBe(FILE_SIGNS.file1);
      expect(checkSign(dir1, 'file2')).toBe(FILE_SIGNS.file2);
      expect(checkSign(dir1, 'pic.png')).toBe(FILE_SIGNS['pic.png']);
      expect(checkSign(dir2, 'file3')).toBe(FILE_SIGNS.file3);
      expect(checkSign(dir2, 'file4')).toBe(FILE_SIGNS.file4);
      expect(checkSign(dir2, 'pic.jpeg')).toBe(FILE_SIGNS['pic.jpeg']);
    });
  });

  describe('when there is a file with the same sign', () => {
    it('collects it everyway', async () => {
      expect.hasAssertions();

      // init
      const { dir1, theSame } = DIRS;

      // process
      await collect({ dirpath: dir1 });
      await collect({ dirpath: theSame });

      // check
      const cachedFiles = await File.fetchAll();
      const checkSign = checkFunction(cachedFiles);

      expect(checkSign(dir1, 'file1')).toBe(FILE_SIGNS.file1);
      expect(checkSign(theSame, 'thesame1')).toBe(FILE_SIGNS.thesame1);
    });
  });
});
