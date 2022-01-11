const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');

module.exports.getUser = (req, res, next) => {
  const {email, name} = req.body
  User.find(email, name)
    .orFail()
    .then((user) => {
      if(email === res.data.email.toString() & name === res.data.name.toString()) {
      res.send({ data: user })
    }
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('User not found');
      }
    })
    .catch(next);
};