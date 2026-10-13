const productModel = require("../models/productModel");

async function getAllProducts(_req, res, next) {
  try {
    const products = await productModel.findAll();
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "ID produk harus berupa bilangan bulat positif."
    });
  }

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: `Produk dengan ID ${id} tidak ditemukan.`
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllProducts, getProductById };
