const articlesRouter = require('express').Router();
const { getArticles, createArticle, delArticle} = require('../controllers/articles');
const { celebrate, Joi } = require('celebrate');

articlesRouter.get('/articles', getArticles);

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL)

  })
 }), createArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex()
  })
 }), delArticle);

module.exports = {
  articlesRouter,
};
