exports.up = function(connection, Promise) {
  return connection.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').notNullable();
    commentsTable
      .foreign('author')
      .references('username')
      .inTable('users')
      .onDelete('CASCADE');
    commentsTable.integer('article_id').notNullable();
    commentsTable
      .foreign('article_id')
      .references('article_id')
      .inTable('articles')
      .onDelete('CASCADE');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.date('created_at');
    commentsTable.text('body').notNullable();
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('comments');
};
