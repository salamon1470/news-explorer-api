const articlesRouter = require('express').Router();
const { getArticles, createArticle, delArticle} = require('../controllers/articles');


articlesRouter.get('/articles', getArticles);

articlesRouter.post('/articles', createArticle);

articlesRouter.delete('/articles/:articleId', delArticle);

module.exports = {
  articlesRouter,
};