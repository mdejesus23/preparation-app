const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// const username = "dejesusmelnard";
const pass = "zZRK0AgPwk99fW9K";

let _db;

const URI = `mongodb://dejesusmelnard:${pass}@ac-rqst6ya-shard-00-00.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-01.acl3rer.mongodb.net:27017,ac-rqst6ya-shard-00-02.acl3rer.mongodb.net:27017/preparation?ssl=true&replicaSet=atlas-17b4b2-shard-0&authSource=admin&retryWrites=true&w=majority`;

// The mongoConnect function is defined to establish a connection to the MongoDB database.
const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(URI);
    console.log(client);
    console.log("Database Connected!");
    _db = client.db();
    callback();
  } catch (err) {
    console.log(err);
    console.log("Error occured in connecting database!");
    throw err;
  }
};

const getDb = () => {
  // if _db is true, meaning if the database is connected successful
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
