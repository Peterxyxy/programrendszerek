const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  signupDate: { type: Date, required: true, default: Date.now },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'buyer', 'guest'], required: true, default: 'guest' },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  address: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'address' }
  ],
}, { collection: 'user' });

// Hash the password before saving the user
userSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(error, hash) {
        if (error) {
          return next(error);
        }
        user.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});

// Compare passwords for authentication
userSchema.methods.comparePasswords = function(password, nx) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    nx(err, isMatch);
  });
};

// Add a product to the users cart
userSchema.methods.addToCart = function(productId, quantity, nx) {
  const cartItem = this.cart.find(item => item.productId.toString() === productId.toString());
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    this.cart.push({ productId, quantity });
  }
  this.save(nx);
};

// Remove a product from the users cart
userSchema.methods.removeFromCart = function(productId, nx) {
  this.cart = this.cart.filter(item => item.productId.toString() !== productId.toString());
  this.save(nx);
};

module.exports = mongoose.model('user', userSchema);