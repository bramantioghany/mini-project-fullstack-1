// Data Product 1 sengaja hardcode sesuai requirement assignment.
const product = {
  name: "Laptop A",
  price: 8500000,
  description: "Laptop untuk produktivitas harian, belajar, dan pekerjaan kantor.",
  processor: "Intel Core i5",
  memory: "RAM 16 GB",
  storage: "SSD 512 GB",
  stock: "Tersedia"
};

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);

document.getElementById("product-name").textContent = product.name;
document.getElementById("product-price").textContent = formatRupiah(product.price);
document.getElementById("product-description").textContent = product.description;
document.getElementById("product-processor").textContent = product.processor;
document.getElementById("product-memory").textContent = product.memory;
document.getElementById("product-storage").textContent = product.storage;
document.getElementById("product-stock").textContent = product.stock;

const contactButton = document.getElementById("contact-button");
const contactFeedback = document.getElementById("contact-feedback");

contactButton.addEventListener("click", () => {
  contactFeedback.textContent =
    "Demo interaksi: Anda memilih " + product.name + ". Belum ada transaksi sungguhan.";
});
