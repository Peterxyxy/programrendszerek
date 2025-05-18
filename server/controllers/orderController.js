const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const orderModel = mongoose.model('order');
const productModel = mongoose.model('product');

// API endpoint to create a new order (buyer only)
router.post('/', (req, res) => {
  const { products, shippingAddress } = req.body;

  if (!req.isAuthenticated() || req.user.role !== 'buyer' && req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  if (!products || !shippingAddress) {
    return res.status(400).send('Missing required fields: products or shippingAddress');
  }

  // Calculate total price
  let totalPrice = 0;
  const productPromises = products.map((item) =>
    productModel.findById(item.productId).then((product) => {
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for product: ${product.name}`);
      totalPrice += product.price * item.quantity;
      return product;
    })
  );

  Promise.all(productPromises)
    .then(() => {
      const newOrder = new orderModel({
        buyer: req.user._id,
        products,
        totalPrice,
        shippingAddress,
      });

      return newOrder.save();
    })
    .then((savedOrder) => {
      // Reduce stock for each product
      const stockUpdatePromises = products.map((item) =>
        productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { new: true }
        )
      );

      return Promise.all(stockUpdatePromises).then(() => savedOrder);
    })
    .then((savedOrder) => {
      return res.status(201).send(savedOrder);
    })
    .catch((err) => {
      return res.status(500).send(err.message || err);
    });
});

// API endpoint to get all orders (admin only)
router.get('/', (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  orderModel
    .find({})
    .populate('buyer', 'username')
    .populate('products.productId', 'name price')
    .populate('shippingAddress')
    .then((orders) => {
      return res.status(200).send(orders);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to get a single order by ID (buyer or admin)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!req.isAuthenticated()) {
    return res.status(401).send('You are not logged in');
  }

  orderModel
    .findById(id)
    .populate('buyer', 'username')
    .populate('products.productId', 'name price')
    .populate('shippingAddress')
    .then((order) => {
      if (!order) return res.status(404).send('Order not found');
      if (req.user.role !== 'admin' && order.buyer.toString() !== req.user._id.toString()) {
        return res.status(403).send('Access denied');
      }
      return res.status(200).send(order);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to update the status of an order (admin only)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  if (!['pending', 'completed', 'canceled'].includes(status)) {
    return res.status(400).send('Invalid status value');
  }

  orderModel
    .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
    .then((updatedOrder) => {
      if (!updatedOrder) return res.status(404).send('Order not found');
      return res.status(200).send(updatedOrder);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to delete an order (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  orderModel
    .findByIdAndDelete(id)
    .then((deletedOrder) => {
      if (!deletedOrder) return res.status(404).send('Order not found');
      return res.status(200).send({ message: 'Order deleted successfully' });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

module.exports = router;