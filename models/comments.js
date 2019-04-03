const connection = require('../db/connection');

exports.updateComment = (req) => {
  const id = req.params.comments_id;
  const inc_votes = req.body.inc_votes;
  return connection
    .select('*')
    .from('comments')
    .where('comment_id', '=', id)
    .increment('votes', inc_votes)
    .returning('*');
};
