const usersRouter = require('express').Router();
const { getUser } = require('../controllers/users');
const { authorize } = require('../middlewares/auth');

usersRouter.get('/users/me', authorize, getUser);

module.exports = {
  usersRouter,
};
