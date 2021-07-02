import makeUsersDb from './users-db'
import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient

const url = process.env.USERS_SERVICE_DB_URL
const dbName = process.env.USERS_SERVICE_DB_NAME

console.log("url: " + url)
console.log("name: " + dbName)
const client = new MongoClient(url, { useNewUrlParser: true })

export async function makeDb () {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}

const usersDb = makeUsersDb({ makeDb })
export default usersDb
