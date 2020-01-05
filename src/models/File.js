const TABLE_NAME = 'files';

module.exports = (bookshelf) => {
  const { knex } = bookshelf;

  return bookshelf.model('File', {
    tableName: TABLE_NAME,
  }, {
    async createNew(attrs) {
      await new this(attrs).save();
    },
    async update(id, attrs) {
      await new this({ id }).save(attrs, { method: 'update' });
    },
    findAllStream() {
      return this.query().orderBy('filepath').stream();
    },
    async* findAllGen() {
      const size = 100;
      let offset = 0;

      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const items = await this.query().offset(offset).limit(size).orderBy('filepath');
        if (items.length === 0) {
          break;
        }

        // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
        for await (const item of items) {
          yield item;
        }

        offset += size;
      }
    },
    async countByFilePath(filePath) {
      return this
        .where('filepath', filePath)
        .count();
    },
    findDoublesInDirectoryStream(directoryPath) {
      let condition = '';
      const binding = {};

      if (directoryPath) {
        condition = ' AND filepath LIKE :dirpath';
        binding.dirpath = `${directoryPath}%`;
      }

      return knex
        .raw(`
          SELECT *
            FROM ${TABLE_NAME}
            WHERE sign IN (
              SELECT sign
              FROM ${TABLE_NAME}
              GROUP BY sign
              HAVING COUNT(*) > 1
            )
            ${condition}
            ORDER BY filepath
        `, binding)
        .stream();
    },
    async findAllForSign(sign) {
      const records = await this
        .where('sign', sign)
        .orderBy('filepath')
        .fetchAll();

      return records.toJSON();
    },
    async deleteById(id) {
      await new this({ id }).destroy();
    },
  });
};
