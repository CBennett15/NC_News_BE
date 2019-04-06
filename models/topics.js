const connection = require('../db/connection');

exports.getTopics = ({ topic }) => {
  return connection
    .select('*')
    .from('topics')
    .modify(function(queryBuilder) {
      if (topic) {
        queryBuilder.where('slug', topic);
      }
    })
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
