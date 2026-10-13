-- TechStore mini project (MySQL 8+)
-- Jalankan file ini pada MySQL lokal sebelum menjalankan backend.

CREATE DATABASE IF NOT EXISTS mini_project_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mini_project_db;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(12, 2) UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  processor VARCHAR(100) NOT NULL,
  memory VARCHAR(100) NOT NULL,
  storage VARCHAR(100) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Hapus komentar pada baris DELETE jika ingin mengulang seed dari kondisi bersih.
-- DELETE FROM products;

INSERT INTO products
  (id, name, price, description, processor, memory, storage, stock, image_url)
VALUES
  (1, 'Laptop A', 8500000.00,
   'Laptop untuk produktivitas harian, belajar, dan pekerjaan kantor.',
   'Intel Core i5', 'RAM 16 GB', 'SSD 512 GB', 8, NULL),
  (2, 'Laptop B', 12000000.00,
   'Laptop untuk multitasking, pekerjaan kreatif, dan produktivitas tingkat lanjut.',
   'Intel Core i7', 'RAM 16 GB', 'SSD 1 TB', 5, NULL)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  description = VALUES(description),
  processor = VALUES(processor),
  memory = VALUES(memory),
  storage = VALUES(storage),
  stock = VALUES(stock),
  image_url = VALUES(image_url);

-- Uji query:
-- SELECT * FROM products;
-- SELECT * FROM products WHERE id = 2;
