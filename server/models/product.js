const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the product
  description: { type: String, required: false }, // Description of the product
  price: { type: Number, required: true, min: 0 }, // Price of the product
  stock: { type: Number, required: true, min: 0 }, // Available stock quantity
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the product was added
  updatedAt: { type: Date, default: Date.now } // Timestamp for the last update
}, { collection: 'product' });

// Middleware to update the `updatedAt` field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('product', productSchema);