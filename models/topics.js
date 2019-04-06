const connection = require('../db/connection');

exports.getTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .returning('*');
};
exports.getTopicsByTopic = ({ topic }) => {
  return connection('topics').where('slug', '=', topic);
};
exports.addTopic = (req) => {
  const body = req.body;
  return connection
    .insert({
      slug: body.slug,
      description: body.description,
    })
    .into('topics')
    .returning('*');
};
