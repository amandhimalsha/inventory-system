const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config({ path: __dirname + '/.env' });
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Inventory System Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

console.log("Mongo URI:", process.env.MONGO_URI);

//register brand routes
const brandRoutes = require("./routes/brandRoutes");
app.use("/api/brands", brandRoutes);
