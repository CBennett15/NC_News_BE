exports.up = function(connection, Promise) {
  console.log('creating table..');
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title');
    articlesTable.text('body');
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic');
    articlesTable
      .foreign('topic')
      .references('slug')
      .inTable('topics');
    articlesTable.string('author');
    articlesTable
      .foreign('author')
      .references('username')
      .inTable('users');
    articlesTable.date('created_at');
  });
};

exports.down = function(connection, Promise) {
  console.log('dropping table...');
  return connection.schema.dropTable('articles');
};
