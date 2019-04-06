const topicsRouter = require('express').Router();
const { sendTopics, addNewTopic } = require('../controllers/topics');
const { methodNotAllowed } = require('../errors/index');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(addNewTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
