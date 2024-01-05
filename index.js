const express = require("express");
const { connectToDb, db } = require("./db");
const jwt = require("jsonwebtoken");
const app = express();

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (isValidLogin(username, password)) {
    const token = jwt.sign({ username }, "your-secret-key", { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

function isValidLogin(username, password) {
  const user = data.users.find(u => u.username === username && u.password === password);
  return !!user;
}

app.get("/api/inventory", async (req, res) => {
  const { lowQuantity } = req.query;

  let query = {};
  if (lowQuantity === "true") {
    query = { instock: { $lt: 100 } };
  }

  const inventory = await db.inventories.find(query).toArray();
  res.json(inventory);
});
app.listen(3000, () => {
  console.log("App is running at 3000");
  connectToDb();
});

app.use("/api", (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    jwt.verify(token, "your-secret-key");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
});

app.get("/api/orders", async (req, res) => {
  const orders = await db.orders.find({}).toArray();
  const ordersWithDescriptions = await Promise.all(
    orders.map(async order => {
      const product = await db.inventories.findOne({ sku: order.item });
      return { ...order, productDescription: product.description };
    })
  );
  res.json(ordersWithDescriptions);
});