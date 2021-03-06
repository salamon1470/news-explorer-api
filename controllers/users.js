const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const NotAuthenticatedError = require('../errors/not-authenticated-err');
const ConflictError = require('../errors/conflict-err');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send(
        {
          data: {
            name: user.name,
            email: user.email,
          },
        },
      );
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
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name, email: user.email, _id: user._id, __v: user.__v,
      },
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError(err.message);
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError('User already exists');
      }
    })

    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({
        token,
      });
    })
    .catch(() => {
      throw new NotAuthenticatedError('Incorrect email or password');
    })
    .catch(next);
};
