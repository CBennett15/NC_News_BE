exports.up = function(connection, Promise) {
  console.log('creating table..');
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title');
    articlesTable.string('body');
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic');
    articlesTable.string('author');
    articlesTable.timestamp('created at');
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping table...');
  return connection.schema.dropTable('articles');
};
