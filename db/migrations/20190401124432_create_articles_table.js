exports.up = function(connection, Promise) {
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').notNullable();
    articlesTable
      .foreign('topic')
      .references('slug')
      .inTable('topics')
      .onDelete('CASCADE');
    articlesTable.string('author').notNullable();
    articlesTable
      .foreign('author')
      .references('username')
      .inTable('users')
      .onDelete('CASCADE');
    articlesTable.date('created_at');
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('articles');
};
