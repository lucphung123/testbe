const { MongoClient } = require("mongodb");

const db = {};

const connectToDb = () => {
  const client = new MongoClient("mongodb://localhost:27017");
  client.connect((err) => {
    if (err) {
      console.error("Lỗi kết nối đến MongoDB:", err);
      return;
    }

    const database = client.db("your_db_name");
    db.inventories = database.collection("inventories");
    db.orders = database.collection("orders");
    db.users = database.collection("users");
  });
};

module.exports = { connectToDb, db };
