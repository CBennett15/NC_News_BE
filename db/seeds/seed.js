const {
  articlesData,
  usersData,
  topicsData,
  commentsData,
} = require('../data');

exports.seed = (connection, Promise) => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => {
      return connection.insert(topicsData).into('topics');
    })
    .then(() => {
      return connection.insert(usersData).into('users');
    })
    .then(() => {
      return connection.insert(articlesData).into('articles');
    })
    .then(() => {
      return connection.insert(commentsData).into('comments');
    });
};
