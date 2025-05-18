const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productModel = mongoose.model('product');

// API endpoint to create a new product (admin only)
router.post('/', (req, res) => {
  const { name, description, price, stock, category } = req.body;

  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  const newProduct = new productModel({
    name,
    description,
    price,
    stock,
    category,
  });

  newProduct
    .save()
    .then((savedProduct) => {
      return res.status(201).send(savedProduct);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to get all products (accessible to all users)
router.get('/', (req, res) => {
  productModel
    .find({})
    .then((products) => {
      return res.status(200).send(products);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to get a single product by ID (accessible to all users)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  productModel
    .findById(id)
    .then((product) => {
      if (!product) return res.status(404).send('Product not found');
      return res.status(200).send(product);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to update a product by ID (admin only)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;

  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  productModel
    .findByIdAndUpdate(
      id,
      { name, description, price, stock, category },
      { new: true, runValidators: true }
    )
    .then((updatedProduct) => {
      if (!updatedProduct) return res.status(404).send('Product not found');
      return res.status(200).send(updatedProduct);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to delete a product by ID (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  productModel
    .findByIdAndDelete(id)
    .then((deletedProduct) => {
      if (!deletedProduct) return res.status(404).send('Product not found');
      return res.status(200).send({ message: 'Product deleted successfully' });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

module.exports = router;