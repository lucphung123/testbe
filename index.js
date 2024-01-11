const express = require("express");
const { connectToDb, db } = require("./db");
const jwt = require("jsonwebtoken");

const app = express();
const secretKey = process.env.SECRET_KEY || "your-secret-key";

app.use("/api", (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Không xác thực - Thiếu token" });
  }

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Không xác thực - Token không hợp lệ" });
  }
});

app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (isValidLogin(username, password)) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
  }
});

function isValidLogin(username, password) {
  const user = data.users.find(
    (u) => u.username === username && u.password === password
  );
  return !!user;
}

app.get("/api/inventory", async (req, res) => {
  const { lowQuantity } = req.query;

  let query = {};
  if (lowQuantity === "true") {
    query = { instock: { $lt: 100 } };
  }

  try {
    const inventory = await db.inventories.find(query).toArray();
    res.json(inventory);
  } catch (error) {
    console.error("Lỗi khi truy vấn kho:", error);
    res.status(500).json({ error: "Lỗi Nội bộ của máy chủ" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await db.orders.find({}).toArray();
    const ordersWithDescriptions = await Promise.all(
      orders.map(async (order) => {
        const product = await db.inventories.findOne({ sku: order.item });
        return { ...order, productDescription: product.description };
      })
    );
    res.json(ordersWithDescriptions);
  } catch (error) {
    console.error("Lỗi khi truy vấn đơn đặt hàng:", error);
    res.status(500).json({ error: "Lỗi Nội bộ của máy chủ" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại cổng ${port}`);
  connectToDb();
});
