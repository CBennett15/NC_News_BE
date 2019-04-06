const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticlesById,
  updateArticlesById,
  deleteArticlesByID,
  sendCommentsByArticle,
  addCommentToArticle,
} = require('../controllers/articles');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(sendArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:articles_id')
  .get(sendArticlesById)
  .patch(updateArticlesById)
  .delete(deleteArticlesByID)
  .all(methodNotAllowed);

articlesRouter
  .route('/:articles_id/comments')
  .get(sendCommentsByArticle)
  .post(addCommentToArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
