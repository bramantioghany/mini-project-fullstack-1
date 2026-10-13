TechStore — Mini Project Fullstack

Aplikasi katalog produk laptop sederhana yang dibangun menggunakan HTML, CSS, JavaScript, Node.js, Express.js, dan MySQL. Proyek ini mendemonstrasikan proses pengambilan data produk dari database melalui REST API dan menampilkannya secara dinamis pada halaman frontend.

1. Teknologi yang Digunakan
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL 8+
Database driver: mysql2/promise
Environment configuration: dotenv
Cross-Origin Resource Sharing: cors
Local development server: VS Code Live Server

2. Struktur Proyek
mini-project-fullstack-1/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── productController.js
│   ├── models/
│   │   └── productModel.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── .env
│   ├── server.js
│   ├── test-db.js
│   └── package.json
│
├── frontend/
│   ├── product-2.html
│   └── product-2.js
│
└── README.md

Catatan: Struktur di atas menggambarkan susunan file yang digunakan atau dibahas selama pengembangan. Sesuaikan nama file dan folder apabila implementasi aktual proyek berbeda.

3. Persiapan Lingkungan

Pastikan perangkat sudah memiliki:

Node.js dan npm.
XAMPP dengan MySQL aktif.
Visual Studio Code atau editor kode lainnya.
Browser untuk menjalankan frontend.
Ekstensi Live Server jika menggunakan VS Code.

Periksa instalasi Node.js dan npm melalui PowerShell:

node --version
npm --version

4. Menyiapkan Database MySQL
4.1 Menjalankan XAMPP
Buka XAMPP Control Panel.
Klik Start pada Apache.
Klik Start pada MySQL.
Pastikan kedua service berjalan.

Buka phpMyAdmin melalui:

http://localhost/phpmyadmin

4.2 Membuat database dan tabel

Buka tab SQL, kemudian jalankan skrip berikut.

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

INSERT INTO products (
  id, name, price, description,
  processor, memory, storage, stock, image_url
)
VALUES
(
  1, 'Laptop A', 8500000.00,
  'Laptop untuk produktivitas harian, belajar, dan pekerjaan kantor.',
  'Intel Core i5', 'RAM 16 GB', 'SSD 512 GB', 8, NULL
),
(
  2, 'Laptop B', 12000000.00,
  'Laptop untuk multitasking, pekerjaan kreatif, dan produktivitas tingkat lanjut.',
  'Intel Core i7', 'RAM 16 GB', 'SSD 1 TB', 5, NULL
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  description = VALUES(description),
  processor = VALUES(processor),
  memory = VALUES(memory),
  storage = VALUES(storage),
  stock = VALUES(stock),
  image_url = VALUES(image_url);

4.3 Memeriksa data produk

Jalankan query:

USE mini_project_db;

SELECT * FROM products WHERE id = 2;


Data yang diharapkan adalah Laptop B dengan harga Rp12.000.000, prosesor Intel Core i7, RAM 16 GB, SSD 1 TB, dan stok 5 unit.

5. Konfigurasi Backend
5.1 File environment

Buat atau periksa file backend/.env.

PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mini_project_db


Konfigurasi tersebut sesuai dengan lingkungan XAMPP lokal apabila akun root memang tidak menggunakan password.

Penting: sesuaikan username dan password dengan konfigurasi MySQL pada perangkat masing-masing. Jangan menggunakan konfigurasi akun tanpa password untuk lingkungan produksi.

Pastikan .env tidak dimasukkan ke version control. Tambahkan ke .gitignore:

backend/.env
backend/node_modules/

5.2 Instalasi dependency

Buka PowerShell di folder backend:

npm install


Jika paket yang dibutuhkan belum tersedia, instal:

npm install express mysql2 dotenv cors

5.3 Konfigurasi koneksi database

File backend/config/database.js bertanggung jawab membuat connection pool MySQL.

const mysql = require("mysql2/promise");

const requiredVariables = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingVariables = requiredVariables.filter(
  (key) => !process.env[key]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Konfigurasi database belum lengkap. Periksa variabel: ${missingVariables.join(", ")}`
  );
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


Pastikan dotenv dimuat sebelum file konfigurasi database diimpor, misalnya pada bagian awal server.js:

require("dotenv").config();

5.4 Model produk

File backend/models/productModel.js berisi query database untuk mengambil produk.

const pool = require("../config/database");

async function findAll() {
  const [rows] = await pool.execute(
    `SELECT id, name, price, description, processor, memory,
            storage, stock, image_url
     FROM products
     ORDER BY id ASC`
  );

  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, price, description, processor, memory,
            storage, stock, image_url
     FROM products
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

module.exports = { findAll, findById };


Penggunaan parameter ? dengan pool.execute() membantu mencegah SQL injection dengan memisahkan nilai input dari pernyataan SQL.

5.5 Controller dan route

Alur endpoint detail produk menggunakan controller untuk memanggil model dan mengirimkan hasilnya sebagai JSON. Route menghubungkan URL API dengan controller.

Pemetaan endpoint yang digunakan:

Method	Endpoint	Fungsi
GET	/api/products	Mengambil daftar produk
GET	/api/products/:id	Mengambil detail produk berdasarkan ID

Nama file, pemetaan route, dan implementasi controller harus mengikuti kode aktual pada proyek.

5.6 Konfigurasi CORS

Karena frontend berjalan di port 5500 dan backend berjalan di port 3000, browser menganggap keduanya berbeda origin.

Pastikan server.js memasang middleware CORS sebelum route API:

const cors = require("cors");

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ]
}));


Tambahkan konfigurasi tersebut pada aplikasi Express yang sudah ada. Jangan membuat instance app kedua hanya untuk memasang CORS.

Batasi daftar origin sesuai alamat frontend yang benar-benar digunakan.

6. Menjalankan Backend

Dari folder backend, jalankan:

npm run dev


Jika berhasil, terminal akan menampilkan pesan:

TechStore berjalan di http://localhost:3000


Jika muncul EADDRINUSE, artinya port 3000 sedang digunakan. Hentikan server lama dengan Ctrl + C pada terminal yang sesuai sebelum menjalankan instance baru.

7. Menguji Koneksi Database dan API
7.1 Tes koneksi database

Jika file test-db.js tersedia, jalankan:

node test-db.js


Hasil yang diharapkan:

Database terhubung: { db: 'mini_project_db', test: 1 }


Jika hasil berbeda, periksa status MySQL, konfigurasi .env, kredensial, dan keberadaan database.

7.2 Tes endpoint detail produk

Buka URL berikut:

http://localhost:3000/api/products/2

Respons yang diharapkan:

{
  "id": 2,
  "name": "Laptop B",
  "price": "12000000.00",
  "description": "Laptop untuk multitasking, pekerjaan kreatif, dan produktivitas tingkat lanjut.",
  "processor": "Intel Core i7",
  "memory": "RAM 16 GB",
  "storage": "SSD 1 TB",
  "stock": 5,
  "image_url": null
}


Nilai harga dapat berupa string karena kolom MySQL menggunakan tipe DECIMAL. Frontend mengubahnya menjadi angka sebelum memformat harga rupiah.

8. Menjalankan Frontend

Buka folder proyek di Visual Studio Code.

Pastikan backend masih berjalan pada port 3000.
Buka frontend/product-2.html.
Klik kanan file tersebut.
Pilih Open with Live Server.

Frontend akan dapat diakses melalui:

http://127.0.0.1:5500/frontend/product-2.html

Konfigurasi URL API

Di frontend/product-2.js, gunakan URL backend yang benar:

const API_URL = "http://localhost:3000/api/products/2";


Jangan menggunakan URL relatif /api/products/2 apabila frontend dilayani langsung oleh Live Server tanpa proxy API. URL relatif tersebut akan diarahkan ke port 5500, bukan 3000.

9. Alur Lengkap API product-2.html

Bagian ini menjelaskan proses pengambilan data Laptop B dari database sampai tampil di browser.

Tahap 1 — Browser membuka halaman

Pengguna membuka:

http://127.0.0.1:5500/frontend/product-2.html


File HTML memuat JavaScript yang menangani detail produk, yaitu product-2.js.

Tahap 2 — JavaScript memanggil API

Saat file JavaScript dijalankan, fungsi loadProduct() memanggil:

const response = await fetch(
  "http://localhost:3000/api/products/2"
);


Permintaan HTTP GET dikirimkan ke backend untuk mengambil produk dengan ID 2.

Tahap 3 — Express menerima permintaan

Express mencocokkan permintaan dengan route detail produk dan memanggil controller terkait.

Controller mengambil parameter ID dari URL, kemudian memanggil fungsi model untuk mengambil produk.

Tahap 4 — Model menjalankan query SQL

Fungsi findById(id) menjalankan query:

SELECT id, name, price, description, processor,
       memory, storage, stock, image_url
FROM products
WHERE id = ?;


Nilai parameter yang dikirim adalah 2.

MySQL mencari produk dengan ID tersebut pada tabel products di database mini_project_db.

Tahap 5 — Backend mengembalikan JSON

Jika produk ditemukan, backend mengirimkan data sebagai respons JSON dengan status HTTP yang sesuai.

Contoh data penting yang dikembalikan:

{
  "id": 2,
  "name": "Laptop B",
  "price": "12000000.00",
  "processor": "Intel Core i7",
  "memory": "RAM 16 GB",
  "storage": "SSD 1 TB",
  "stock": 5
}

Tahap 6 — Frontend membaca respons

JavaScript memeriksa status respons:

if (!response.ok) {
  throw new Error(`Request gagal (${response.status})`);
}

const product = await response.json();


Jika permintaan gagal, penanganan error mengarahkan proses ke blok catch.

Jika berhasil, objek product berisi data dari backend.

Tahap 7 — JavaScript mengisi elemen HTML

Data produk dimasukkan ke elemen halaman menggunakan textContent:

elements.name.textContent = product.name;
elements.price.textContent = formatRupiah(product.price);
elements.description.textContent = product.description;
elements.processor.textContent = product.processor;
elements.memory.textContent = product.memory;
elements.storage.textContent = product.storage;


Penggunaan textContent membantu mencegah teks dari API diperlakukan sebagai markup HTML.

Fungsi formatRupiah() memformat nilai harga menjadi format mata uang Indonesia, misalnya Rp12.000.000.

Tahap 8 — Detail produk ditampilkan

Jika seluruh proses berhasil:

elements.detail.hidden = false;
elements.status.hidden = true;


Bagian detail produk ditampilkan, sedangkan pesan status error disembunyikan.

10. Ringkasan Aliran Data
Browser
   |
   v
product-2.html
   |
   v
product-2.js
   |
   | GET /api/products/2
   v
Express.js
   |
   v
productController.js
   |
   v
productModel.js
   |
   v
MySQL: mini_project_db
   |
   | Data Laptop B
   v
JSON Response
   |
   v
product-2.js
   |
   v
Elemen HTML diperbarui
   |
   v
Detail Laptop B tampil

11. Troubleshooting
Error	Kemungkinan penyebab	Solusi
ECONNREFUSED	MySQL belum berjalan atau port salah	Periksa service MySQL dan port 3306
ER_ACCESS_DENIED_ERROR	Kredensial MySQL tidak sesuai	Periksa DB_USER dan DB_PASSWORD
ER_BAD_DB_ERROR	Database belum tersedia	Buat mini_project_db dan tabelnya
EADDRINUSE	Port backend sudah digunakan	Hentikan server lama atau periksa proses yang memakai port 3000
404 Not Found pada port 5500	URL API relatif mengarah ke frontend	Gunakan URL backend http://localhost:3000/api/products/2
CORS policy error	Origin frontend belum diizinkan	Konfigurasikan middleware CORS di Express
Failed to fetch	Permintaan gagal atau diblokir browser	Periksa URL API, status backend, CORS, dan Console
Detail tidak tampil	Error saat memproses data atau memperbarui DOM	Periksa Console browser dan struktur respons JSON

12. Checklist Sebelum Demo
Apache dan MySQL XAMPP berjalan.
Database mini_project_db tersedia.
Tabel products memiliki data dengan ID 2.
File .env berisi konfigurasi yang benar.
node test-db.js berhasil.
Backend berjalan pada port 3000.
Endpoint /api/products/2 mengembalikan JSON.
CORS mengizinkan origin frontend.
Frontend dibuka melalui Live Server.
product-2.js menggunakan URL API yang benar.
Detail Laptop B tampil tanpa error pada Console.

13. Catatan Pengembangan

Proyek ini menggunakan pemisahan tanggung jawab antara frontend, controller, model, dan database.

Frontend bertanggung jawab menampilkan informasi kepada pengguna.
Controller mengatur alur permintaan dan respons HTTP.
Model menangani query database.
Database menyimpan data produk secara persisten.

Pemisahan ini memudahkan debugging, pemeliharaan, dan pengembangan fitur berikutnya, seperti daftar produk dinamis, pencarian, filter, tambah produk, edit produk, dan hapus produk.

TechStore — Mini Project Fullstack

Dibuat sebagai latihan integrasi frontend, REST API, backend Node.js/Express, dan database MySQL.