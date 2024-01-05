const { MongoClient } = require("mongodb");

const data = {
  orders: [
    { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
    { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
    { "_id" : 3, "item" : "pecans", "price" : 20, "quantity" : 3 },
  ],
  inventory: [
    { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
    { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
    { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
    { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 },
  ],
  users: [
    {"username": "admin", "password": "MindX@2022"},
    {"username": "alice", "password": "MindX@2022"}
  ]
};

const connectAndImport = async () => {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const database = client.db("your_db_name");

    // Insert data into collections
    await database.collection("orders").insertMany(data.orders);
    await database.collection("inventories").insertMany(data.inventory);
    await database.collection("users").insertMany(data.users);

    console.log("Data imported successfully.");
  } finally {
    await client.close();
  }
};

connectAndImport();