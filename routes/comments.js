const commentsRouter = require('express').Router();
const {
  updateCommentsById,
  deleteCommentsById,
} = require('../controllers/comments');
const { methodNotAllowed } = require('../errors');

commentsRouter
  .route('/:comments_id')
  .patch(updateCommentsById)
  .delete(deleteCommentsById)
  .all(methodNotAllowed);

module.exports = commentsRouter;
