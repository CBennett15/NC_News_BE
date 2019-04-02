const {
  articlesData,
  usersData,
  topicsData,
  commentsData,
} = require('../data');
const { convertDate, createRef } = require('../utils');

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
      return connection
        .insert(convertDate(articlesData))
        .into('articles')
        .returning('*');
    })
    .then((articleRows) => {
      const articleRef = createRef(articleRows);
      const formattedData = formatData(commentsData, articleRef);
      return connection.insert(formattedData).into('comments');
    });
};
