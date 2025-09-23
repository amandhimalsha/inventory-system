const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Brand = require("../models/Brand");

// @desc Get all products
// @route GET /api/products
router.get("/", async (req, res) => {
  try {
    // populate brand field to show brand name
    const products = await Product.find().populate("brand", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get single product
// @route GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("brand", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create a product
// @route POST /api/products
router.post("/", async (req, res) => {
  try {
    const { name, SKU, quantity, price, description, brand } = req.body;

    // Check required fields
    if (!name || !SKU || !price || !brand) {
      return res.status(400).json({ message: "Name, SKU, price, and brand are required" });
    }

    // Verify brand exists
    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    const product = new Product({
      name,
      SKU,
      quantity,
      price,
      description,
      brand,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update product
// @route PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, SKU, quantity, price, description, brand } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, SKU, quantity, price, description, brand },
      { new: true }
    ).populate("brand", "name");

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
