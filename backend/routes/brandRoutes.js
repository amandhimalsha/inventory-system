const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");

// @desc Get all brands
// @route GET /api/brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Create a brand
// @route POST /api/brands
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const brand = new Brand({ name });
    const savedBrand = await brand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update a brand
// @route PUT /api/brands/:id
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete a brand
// @route DELETE /api/brands/:id
router.delete("/:id", async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
