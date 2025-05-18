const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: false },
  city: { type: String, required: false },
  county: { type: String, required: false },
  postalCode: { type: String, required: false },
  country: { type: String, required: false }
}, { collection: 'address' });

module.exports = mongoose.model('address', addressSchema);