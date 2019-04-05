const { getTopics, addTopic } = require('../models/topics');

exports.sendTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
exports.addNewTopic = (req, res, next) => {
  if (!req.body.slug) {
    return Promise.reject({ status: 400, msg: 'No Slug Included' }).catch(next);
  }
  addTopic(req)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
