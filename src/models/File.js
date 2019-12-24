const TABLE_NAME = 'files';

module.exports = (bookshelf) => {
  const { knex } = bookshelf;

  return bookshelf.model('File', {
    tableName: TABLE_NAME,
  }, {
    createNew(attrs) {
      return new this(attrs).save();
    },
    update(id, attrs) {
      return new this({ id }).save(attrs, { method: 'update' });
    },
    findAllKnex() {
      return this.query().orderBy('filepath');
    },
    async *findAllGen() {
      const size = 100;
      let offset = 0;

      while(true) {
        const items = await this.query().offset(offset).limit(size).orderBy('filepath');
        if (items.length === 0) {
          break;
        }

        for await (const item of items) {
          yield item;
        }

        offset += size;
      }
    },
    countByFilePath(filePath) {
      return this
        .where('filepath', filePath)
        .count();
    },
    findDoublesKnex(directoryPath) {
      let condition = '';
      const binding = {};

      if (directoryPath) {
        condition = ` AND filepath LIKE :dirpath`
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
        `, binding);
    },
    findAllForSign(sign) {
      return this
        .where('sign', sign)
        .orderBy('filepath')
        .fetchAll();
    },
    deleteById(id) {
      return new this({ id }).destroy();
    },
  })
};
