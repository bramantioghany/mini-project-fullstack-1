// Product 2 memperoleh data melalui API, bukan hardcode produk di frontend.
const API_URL = "http://localhost:3000/api/products/2";

const elements = {
  status: document.getElementById("api-status"),
  detail: document.getElementById("product-detail"),
  name: document.getElementById("product-name"),
  price: document.getElementById("product-price"),
  description: document.getElementById("product-description"),
  processor: document.getElementById("product-processor"),
  memory: document.getElementById("product-memory"),
  storage: document.getElementById("product-storage"),
  stock: document.getElementById("product-stock")
};

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(amount));
}

async function loadProduct() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Request gagal (${response.status})`);
    }

    const product = await response.json();

    // textContent mencegah data teks API diperlakukan sebagai HTML.
    elements.name.textContent = product.name;
    elements.price.textContent = formatRupiah(product.price);
    elements.description.textContent = product.description || "Deskripsi belum tersedia.";
    elements.processor.textContent = product.processor || "Tidak dicantumkan";
    elements.memory.textContent = product.memory || "Tidak dicantumkan";
    elements.storage.textContent = product.storage || "Tidak dicantumkan";
    elements.stock.textContent = Number(product.stock) > 0
      ? `Tersedia (${product.stock} unit)`
      : "Stok habis";

    elements.detail.hidden = false;
    elements.status.hidden = true;
  } catch (error) {
    console.error("Gagal memuat produk:", error);
    elements.status.className = "api-status error";
    elements.status.textContent =
      "Detail produk tidak dapat dimuat. Pastikan backend dan database berjalan, lalu muat ulang halaman.";
  }
}

loadProduct();
