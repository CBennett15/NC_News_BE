const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics } = require('../controllers/topics');
const articlesRouter = require('./articles');

apiRouter
  .route('/')
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

apiRouter.route('/topics').get(sendTopics);

apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
