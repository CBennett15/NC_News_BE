const connection = require('../db/connection');

exports.getTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .returning('*');
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
