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
      if (!user) {
        return Promise.reject({ status: 404, msg: 'User Not Found' });
      } else res.status(200).send({ user });
    })
    .catch(next);
};
