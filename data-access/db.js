const mongodb = require('mongodb');
const Id = require('../utils/id');

const MongoClient = mongodb.MongoClient;
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: false, poolSize: 3 });

const { makeUserDb } = require('./user-db');

const role = require("../utils/role");

async function makeDb () {
  if (!client.isConnected()) {
    await client.connect();
  }
  return { db: client.db(dbName), client: client };
}

const userDb = makeUserDb({ makeDb, Id, role });


module.exports.userDb = userDb;