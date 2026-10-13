require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ]
}));
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Sajikan frontend dari server yang sama agar fetch('/api/...') tidak membutuhkan CORS.
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "TechStore API is running" });
});

app.use("/api/products", productRoutes);

// Endpoint fallback untuk route API yang tidak terdaftar.
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API endpoint tidak ditemukan." });
});

// Error handler umum; detail internal tidak dikirim ke client.
app.use((error, _req, res, _next) => {
  console.error("Unhandled server error:", error);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

app.listen(PORT, () => {
  console.log(`TechStore berjalan di http://localhost:${PORT}`);
});
