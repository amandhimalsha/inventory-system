const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // No duplicate brand names
    trim: true,
  },
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model("Brand", brandSchema);
