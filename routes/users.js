const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users');


usersRouter.get('/users/me', getUser)

module.exports = {
  usersRouter,
};
