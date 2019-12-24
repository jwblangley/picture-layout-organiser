const MongoClient = require('mongodb').MongoClient

const mongoIP = '127.0.0.1'
const url = 'mongodb://' + mongoIP + ':27017';
const dbName = 'pictureLayoutOrganiser'

const INITIAL_LOCK_POS = -1

var db
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err)
    return
  }
  db = client.db(dbName)
})

function listUsers(callback) {
  const collection = db.collection('users')
  collection
    .find({})
    .project({ name: 1, _id: 0 })
    .toArray(function(err, users) {
      if (err) {
        console.log(err)
        return
      }
      callback(users.map(u => u.name))
    })
}

function createUser(newName, callback) {
  const collection = db.collection('users')
  collection
    .find({name: newName})
    .toArray(function(err, users) {
      if (err) {
        console.log(err)
        return
      }
      // Check if username already exists
      if (users.length > 0) {
        callback(null, 'Username already exists')
        return
      }

      // Add new user
      collection.insertOne({
          name: newName,
          lockPos: INITIAL_LOCK_POS
        }, function(err, res) {
          if (err) {
            throw err
          }
          callback(res)
        }
      )
    })
}

module.exports = {
  listUsers,
  createUser
}