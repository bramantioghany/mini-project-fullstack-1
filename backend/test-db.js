require("dotenv").config();

const pool = require("./config/database");

async function testConnection() {
  try {
    const [rows] = await pool.execute(
      "SELECT DATABASE() AS db, 1 AS test"
    );

    console.log("Database terhubung:", rows[0]);
  } catch (error) {
    console.error("Kode error:", error.code);
    console.error("Pesan:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();