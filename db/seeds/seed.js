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
    });
};
