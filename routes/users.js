const usersRouter = require('express').Router();
const { sendUserByUsername, sendUsers } = require('../controllers/users');

usersRouter.route('/').get(sendUsers);
usersRouter.route('/:username').get(sendUserByUsername);

module.exports = usersRouter;
