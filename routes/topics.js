const topicsRouter = require('express').Router();
const {
  sendTopics,
  addNewTopic,
  sendTopicsByTopic,
} = require('../controllers/topics');
const { methodNotAllowed } = require('../errors/index');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(addNewTopic)
  .all(methodNotAllowed);

topicsRouter
  .route('/:topic')
  .get(sendTopicsByTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
