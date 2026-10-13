const pool = require("../config/database");

async function findAll() {
  const [rows] = await pool.execute(
    `SELECT id, name, price, description, processor, memory, storage, stock, image_url
     FROM products
     ORDER BY id ASC`
  );

  return rows;
}

async function findById(id) {
  // Parameterized query menghindari penggabungan input ke dalam SQL.
  const [rows] = await pool.execute(
    `SELECT id, name, price, description, processor, memory, storage, stock, image_url
     FROM products
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

module.exports = { findAll, findById };
