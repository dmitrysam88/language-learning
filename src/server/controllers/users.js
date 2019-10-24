const express = require('express');
const router = express.Router();
const _ = require('lodash');
const config = require('../config/config.api');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { getDB } = require('../db/index');

router.get('/api/users', async function(req, res){
  const db = getDB();
  let users = await db.collection('user').find().toArray();
  if(!users){
    users = {};
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(users));
});

router.get('/api/singIn', async function(req, res){
  const db = getDB();
  let { userLogin, userPassword } = req.query;
  let user = await db.collection('user').findOne({ $or: [{ name: userLogin }, { email: userLogin }]});
  res.setHeader('Content-Type', 'application/json');
  if(user && bcrypt.compareSync(userPassword, user.password)){
    user = _.omit(user, 'password')
    let userToken = jwt.sign(user, config.jwtKey);
    user.userToken = userToken;
    res.send(JSON.stringify(user));
  }else{
    res.status(500).send(JSON.stringify({ ok: false, message: "User was not found or password is wrong" }));
  }  
});

router.get('/api/current_user', async function(req, res){
  let currentUser = jwt.verify(req.query.userToken, config.jwtKey);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(currentUser));
});

router.get('/api/user', async function(req, res){
  const db = getDB();
  let { userId } = req.query;
  let user = await db.collection('user').findOne({ _id: userId });
  if(!user){
    user = {};
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(user));
});

router.post('/api/user', async function(req, res){
  const db = getDB();
  let newUser = req.body;
  newUser = Object.assign({}, newUser, { password: bcrypt.hashSync(newUser.password, saltRounds) });
  await db.collection('user').save(newUser);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(newUser));
});

router.put('/api/user', async function(req, res){
  const db = getDB();
  let newUser = _.omit(req.body, '_id');
  newUser = Object.assign({}, newUser, { password: bcrypt.hashSync(newUser.password, saltRounds) });
  let { userId } = req.query;
  let user = await db.collection('user').findOne({ _id: db.ObjectId(userId)});
  user = Object.assign({}, user, newUser);
  await db.collection('user').save(user);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(user));
});

router.delete('/api/user', async function(req, res){
  const db = getDB();
  let { userId } = req.query;
  await db.collection('user').remove({ _id: db.ObjectId(userId) }, { justOne: true });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ ok: true }));
});

module.exports = router;