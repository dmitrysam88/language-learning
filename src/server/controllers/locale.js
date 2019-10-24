const express = require('express');
const router = express.Router();

const { getDB } = require('../db/index');

router.get('/api/locale/names', async function(req, res){
  const db = getDB();
  let locales = await db.collection('locale').find({}, {  projection: { data: 0 }}).toArray();
  if(!locales){
    locales = [];
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(locales));
});

router.get('/api/locale', async function(req, res){
  const db = getDB();
  let answer;
  let { localeName } = req.query;
  let locale = await db.collection('locale').findOne( { key: localeName });
  if(locale && locale.data ){
    answer = JSON.stringify(locale.data);
  }else {
    answer = JSON.stringify({});
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(answer);
});

router.post('/api/locale', async function(req, res){
  const db = getDB();
  let newLocale = req.body;
  await db.collection('locale').save(newLocale);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ newLocale }));
});

router.put('/api/locale', async function(req, res){
  const db = getDB();
  let newLocale = req.body;
  let { localeName } = req.query;
  let locale = await db.collection('locale').findOne( { key: localeName });
  // let data = Object.assign({}, locale.data, newLocale);
  locale = Object.assign({}, locale, { data: newLocale });
  await db.collection('locale').save(locale);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(locale.data));
});

router.delete('/api/locale', async function(req, res){
  const db = getDB();
  let { localeName } = req.query;
  await db.collection('locale').remove({ key: localeName }, { justOne: true });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ ok: true }));
});

module.exports = router;