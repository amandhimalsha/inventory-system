const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// --- GET all sales ---
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().populate("product", "name price");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- GET sale by ID ---
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("product", "name price");
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- CREATE a sale (and reduce product stock) ---
router.post("/", async (req, res) => {
  try {
    const { product, quantitySold } = req.body;

    // Check product exists
    const existingProduct = await Product.findById(product);
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    // Check if enough stock
    if (existingProduct.quantity < quantitySold) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Reduce stock
    existingProduct.quantity -= quantitySold;
    await existingProduct.save();

    // Create sale record
    const sale = new Sale({ product, quantitySold });
    await sale.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- UPDATE a sale (optional: adjust stock accordingly) ---
router.put("/:id", async (req, res) => {
  try {
    const { product, quantitySold } = req.body;

    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // If product or quantity changes, adjust stock
    if (product !== sale.product.toString() || quantitySold !== sale.quantitySold) {
      // Restore previous product stock
      const oldProduct = await Product.findById(sale.product);
      oldProduct.quantity += sale.quantitySold;
      await oldProduct.save();

      // Reduce new product stock
      const newProduct = await Product.findById(product);
      if (!newProduct) return res.status(404).json({ message: "New product not found" });
      if (newProduct.quantity < quantitySold) return res.status(400).json({ message: "Insufficient stock for new product" });
      newProduct.quantity -= quantitySold;
      await newProduct.save();

      sale.product = product;
      sale.quantitySold = quantitySold;
    }

    await sale.save();
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- DELETE a sale (restore product stock) ---
router.delete("/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Restore product stock
    const product = await Product.findById(sale.product);
    product.quantity += sale.quantitySold;
    await product.save();

    await sale.remove();
    res.json({ message: "Sale deleted and stock restored" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
