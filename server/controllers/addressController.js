const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userModel = mongoose.model('user');

// API endpoint to add an address for a user (expects JSON body: { username, address })
const Address = require('../models/address');
const User = require('../models/user');

router.post('/add', async (req, res) => {
  const { username, address } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).send('You are not logged in');
  }

  if (req.user.username !== username && req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    const newAddress = new Address(address);
    await newAddress.save();

    user.address.push(newAddress._id);
    await user.save();

    // Optionally, populate addresses for response
    await user.populate('address');
    return res.status(200).send(user.address);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// API endpoint to update an address for a user (expects JSON body: { username, addressId, address })
router.put('/update', async (req, res) => {
  const { username, addressId, address } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).send('You are not logged in');
  }

  if (req.user.username !== username && req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  try {
    const updatedAddress = await Address.findByIdAndUpdate(addressId, address, { new: true });
    if (!updatedAddress) return res.status(404).send('Address not found');
    return res.status(200).send(updatedAddress);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/list', async (req, res) => {
  const { username } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).send('You are not logged in');
  }

  if (req.user.username !== username && req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  try {
    const user = await User.findOne({ username }).populate('address');
    if (!user) return res.status(404).send('User not found');
    return res.status(200).send(user.address);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;