const { getUsersByUsername, getUsers } = require('../models/users');

exports.sendUsers = (req, res, next) => {
  getUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.sendUserByUsername = (req, res, next) => {
  getUsersByUsername(req.params)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
