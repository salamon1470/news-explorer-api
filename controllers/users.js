const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


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

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((res) => User.create({ name, email })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(err.message);
      }
      if (err.name === 'MongoError' ||  err.code === 11000 ) {
        throw new ConflictError('User already exists');
      }
    })
    .catch(next)
    )
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    res.send({
      token: jwt.sign({ _id: user._id },  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'})
      })
    })
    .catch((err) => {
      throw new NotAuthenticatedError(err.message);
    })
};

