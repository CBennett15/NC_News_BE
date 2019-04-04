const usersRouter = require('express').Router();
const { sendUserByUsername, sendUsers } = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/')
  .get(sendUsers)
  .all(methodNotAllowed);
usersRouter.route('/:username').get(sendUserByUsername);

module.exports = usersRouter;
