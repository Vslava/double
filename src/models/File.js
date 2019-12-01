module.exports = (bookshelf) => (
  bookshelf.model('File', {
    tableName: 'files',
  }, {
    createNew(attrs) {
      return new this(attrs).save();
    },
    findByFilePath(filePath) {
      return this
        .where('filepath', filePath)
        .fetch({ require: false });
    },
    findDoubleSignsKnex() {
      return this.query()
        .select('sign')
        .groupBy('sign')
        .havingRaw('COUNT(*) > 1');
    },
    findAllForSign(sign) {
      return this.where('sign', sign).fetchAll();
    },
  })
);
