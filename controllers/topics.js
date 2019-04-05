const { getTopics, addTopic } = require('../models/topics');

exports.sendTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
exports.addNewTopic = (req, res, next) => {
  addTopic(req)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
