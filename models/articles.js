const connection = require('../db/connection');

exports.getArticles = ({ username, topic }) => {
  return connection
    .select('articles.*', 'comments.article_id')
    .from('articles')
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('comments.article_id', 'articles.article_id')
    .modify(function(queryBuilder) {
      if (username) {
        queryBuilder.where('articles.author', username);
      }
    })
    .modify(function(queryBuilder) {
      if (topic) {
        queryBuilder.where('articles.topic', topic);
      }
    })
    .returning('*');
};

exports.getArticlesById = ({ articles_id }) => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', articles_id);
};

exports.updateArticle = ({ articles_id }) => {
  //   Request body accepts
  //   an object in the form { inc_votes: newVote }
  //   newVote will indicate how much the votes property in the database should be updated by
  //   e.g.
  // { inc_votes: 1 } would increment the current article's vote property by 1
  //   { inc_votes: -100 } would decrement the current article's vote property by 100
};
