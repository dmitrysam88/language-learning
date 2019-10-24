const express = require('express');
const router = express.Router();
const _ = require('lodash');

const { getDB } = require('../db/index');
const config = require('../config/config.api');
const jwt = require('jsonwebtoken');

router.get('/api/articles', async function(req, res){
  const db = getDB();
  let articles = await db.collection('article').find().toArray();
  if(!articles){
    articles = [];
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(articles));
});

router.get('/api/articles/names', async function(req, res){
  const db = getDB();
  let articleNames = await db.collection('article').find({}, { projection: { name: 1, _id: 1, description: 1 }}).toArray();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(articleNames));
});

router.get('/api/article', async function(req, res){
  const db = getDB();
  let { articleId } = req.query;
  let article = await db.collection('article').findOne({ _id: db.ObjectId(articleId) });
  if(!article){
    article = {};
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(article));
});

router.post('/api/article', async function(req, res){
  const db = getDB();
  let newArticle = req.body;
  await db.collection('article').save(newArticle);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(newArticle));
});

router.put('/api/article', async function(req, res){
  const db = getDB();
  let newArticle = _.omit(req.body, '_id');
  let { articleId } = req.query;
  let article = await db.collection('article').findOne({ _id: db.ObjectId(articleId) });
  article = Object.assign({}, article, newArticle);
  await db.collection('article').save(article);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(article));
});

router.delete('/api/article', async function(req, res){
  const db = getDB();
  let { articleId } = req.query;
  await db.collection('article').remove({ _id: db.ObjectId(articleId) }, { justOne: true });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ ok: true }));
});

router.put('/api/article/new_coment', async function(req, res){
  const db = getDB();
  let comment = req.body;
  let user = jwt.verify(comment.author, config.jwtKey);
  let { articleId } = req.query;
  let article = await db.collection('article').findOne({ _id: db.ObjectId(articleId) });
  let maxId = _.get(_.maxBy(article.comments, 'id'), 'id');
  if (!maxId)
    maxId = 0;
  comment = Object.assign({}, _.omit(comment, 'author'), { id: maxId + 1, authorName: user.name, authorId: db.ObjectId(user._id) });
  article.comments.push(comment);
  await db.collection('article').save(article);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comment));
});

router.put('/api/article/coment', async function(req, res){
  const db = getDB();
  let comment = req.body;
  let { articleId } = req.query;
  let article = await db.collection('article').findOne({ _id: db.ObjectId(articleId) });
  comment = Object.assign(_.find(article.comments, { id: comment.id }), { text: comment.text });
  await db.collection('article').save(article);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comment)); 
});

router.delete('/api/article/coment', async function(req, res){
  const db = getDB();
  let { articleId, commentId } = req.query;
  let article = await db.collection('article').findOne({ _id: db.ObjectId(articleId) });
  article = Object.assign({}, article, { comments: _.filter(article.comments, (comment) => comment.id != commentId) });
  await db.collection('article').save(article);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ ok: true }));
});

module.exports = router;