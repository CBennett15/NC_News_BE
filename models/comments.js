const connection = require('../db/connection');

exports.getComments = ({ author, sort_by, order }) => {
  return connection
    .select('*')
    .from('comments')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .modify(function(queryBuilder) {
      if (author) {
        queryBuilder.where('author', author);
      }
    })
    .returning('*');
};

exports.updateComment = (req) => {
  const id = req.params.comments_id;
  const inc_votes = req.body.inc_votes;
  return connection
    .select('*')
    .from('comments')
    .where('comment_id', '=', id)
    .increment('votes', inc_votes || 0)
    .returning('*');
};

exports.deleteComment = ({ comments_id }) => {
  return connection
    .select('*')
    .from('comments')
    .where('comment_id', '=', comments_id)
    .del();
};
