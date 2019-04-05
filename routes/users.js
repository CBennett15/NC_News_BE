const usersRouter = require('express').Router();
const {
  sendUserByUsername,
  sendUsers,
  addNewUser,
} = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/')
  .get(sendUsers)
  .post(addNewUser)
  .all(methodNotAllowed);

usersRouter.route('/:username').get(sendUserByUsername);

module.exports = usersRouter;
