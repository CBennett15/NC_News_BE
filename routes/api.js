const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics, addNewTopic } = require('../controllers/topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');
const endpoints = require('../endpoints.json');

apiRouter
  .route('/')
  .get((req, res) => res.send({ endpoints }))
  .all(methodNotAllowed);

apiRouter
  .route('/topics')
  .get(sendTopics)
  .post(addNewTopic)
  .all(methodNotAllowed);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
