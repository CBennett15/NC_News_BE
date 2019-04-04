const commentsRouter = require('express').Router();
const {
  sendComments,
  updateCommentsById,
  deleteCommentsById,
} = require('../controllers/comments');
const { methodNotAllowed } = require('../errors');

commentsRouter
  .route('/')
  .get(sendComments)
  .all(methodNotAllowed);

commentsRouter
  .route('/:comments_id')
  .patch(updateCommentsById)
  .delete(deleteCommentsById)
  .all(methodNotAllowed);

module.exports = commentsRouter;
