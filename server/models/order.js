const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  }, // Reference to the buyer (registered user)
  products: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product', 
        required: true 
      }, // Reference to the product
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      } // Quantity of the product in the order
    }
  ],
  totalPrice: { 
    type: Number, 
    required: true, 
    min: 0 
  }, // Total price of the order
  shippingAddress: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'address', 
    required: true 
  }, // Reference to the shipping address
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'canceled'], 
    default: 'pending' 
  }, // Status of the order
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // Timestamp for when the order was created
  updatedAt: { 
    type: Date, 
    default: Date.now 
  } // Timestamp for the last update
}, { collection: 'order' });

// Middleware to update the `updatedAt` field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('order', orderSchema);