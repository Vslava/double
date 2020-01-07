/* eslint-disable func-names */
const path = require('path');
const appContext = require('context');

describe(__filename, () => {
  const { findDoubles } = appContext().services;
  const { File } = appContext().models;

  const fileSigns = Object.freeze({
    file1: 'b6ee2058d98027764d589b1e3a102c39',
    file2: '6174e909453ef9d1658f95856eea4c97',
    file3: '02a73a746f187bbdee14bcf8b752d643',
  });

  describe('find all files', () => {
    it('shows files which have doubles in the db', async () => {
      expect.hasAssertions();

      // init
      await new File({
        filepath: path.join('/test1', 'file1'),
        sign: fileSigns.file1,
      }).save();
      await new File({
        filepath: path.join('/test1', 'file2'),
        sign: fileSigns.file2,
      }).save();

      await new File({
        filepath: path.join('/another', 'file3'),
        sign: fileSigns.file3,
      }).save();

      await new File({
        filepath: path.join('/test2', 'file1'),
        sign: fileSigns.file1,
      }).save();
      await new File({
        filepath: path.join('/test2', 'file2'),
        sign: fileSigns.file2,
      }).save();

      const loggerSpy = jest.fn();

      // process
      await findDoubles({}, { logger: loggerSpy });

      // check
      expect(loggerSpy).toHaveBeenCalledTimes(4);
      expect(loggerSpy).toHaveBeenCalledWith('/test1/file1', ['/test2/file1']);
      expect(loggerSpy).toHaveBeenCalledWith('/test1/file2', ['/test2/file2']);
      expect(loggerSpy).toHaveBeenCalledWith('/test2/file1', ['/test1/file1']);
      expect(loggerSpy).toHaveBeenCalledWith('/test2/file2', ['/test1/file2']);
    });
  });

  describe('find in the certain directory', () => {
    it('shows files which have doubles in the db', async () => {
      expect.hasAssertions();

      // init
      await new File({
        filepath: path.join('/dir/test1', 'file1'),
        sign: fileSigns.file1,
      }).save();
      await new File({
        filepath: path.join('/dir/test1', 'file2'),
        sign: fileSigns.file2,
      }).save();

      await new File({
        filepath: path.join('/another', 'file3'),
        sign: fileSigns.file3,
      }).save();

      await new File({
        filepath: path.join('/test2', 'file1'),
        sign: fileSigns.file1,
      }).save();
      await new File({
        filepath: path.join('/test2', 'file2'),
        sign: fileSigns.file2,
      }).save();

      const loggerSpy = jest.fn();

      // process
      await findDoubles({
        dirpath: '/dir',
      }, {
        logger: loggerSpy,
      });

      // check
      expect(loggerSpy).toHaveBeenCalledTimes(2);
      expect(loggerSpy).toHaveBeenCalledWith('/dir/test1/file1', ['/test2/file1']);
      expect(loggerSpy).toHaveBeenCalledWith('/dir/test1/file2', ['/test2/file2']);
    });
  });
});
