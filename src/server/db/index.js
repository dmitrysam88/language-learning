const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const util = require('util');

const config = require('../config/config.db');

let _db;

async function initDB(){
  const connect = util.promisify(MongoClient.connect.bind(MongoClient));
  const client = await connect(config.url, { useUnifiedTopology: true, useNewUrlParser: true });
  _db = client.db(config.dbName);
  _db['ObjectId'] = ObjectID;
}

function getDB(){
  return _db;
}


module.exports = { initDB, getDB };