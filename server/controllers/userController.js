const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const bcrypt = require('bcryptjs');
const { HttpHeaders } = require('http');

// API endpoint to login to the application
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing username or password parameters');
  }

  passport.authenticate('local', (error, user) => {
    if (error) return res.status(500).send(error);

    if (!user) return res.status(401).send('Invalid username or password');

    req.login(user, (error) => {
      if (error) return res.status(500).send(error);

      return res.status(200).send({ username: user.username, role: user.role });
    });
  })(req, res);
});

// API endpoint to update a user by username
router.put('/:username', async (req, res) => {
  const { username } = req.params;
  let { password, role } = req.body;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
  }

  const updateData = req.user.role === 'admin'
    ? { password, role }
    : { password };

  userModel
    .findOneAndUpdate({ username }, updateData, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) return res.status(404).send('User not found');
      return res.status(200).send(updatedUser);
    })
    .catch((err) => res.status(500).send(err));
});

// API endpoint to delete a user by username
router.delete('/:username', (req, res) => {
    const { username } = req.params;

    if (!req.isAuthenticated()) {
        return res.status(401).send('You are not logged in');
    }

    // Only admin or the user themselves can delete
    if (req.user.role !== 'admin' && req.user.username !== username) {
        return res.status(403).send('Access denied');
    }

    userModel
        .findOneAndDelete({ username })
        .then((deletedUser) => {
            if (!deletedUser) return res.status(404).send('User not found');
            return res.status(200).send({ message: 'User deleted successfully' });
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});


router.post('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send({ result: 'success' });
    });
  } else {
    return res.status(401).send({ result: 'You are not logged in' });
  }
});

// API endpoint to register a new user
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).send('Missing username or password parameters');
  }

  try {
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }

    const newUser = new userModel({
      username,
      password,
      role: role || 'buyer',
      signupDate: new Date(),
    });

    const savedUser = await newUser.save();
    return res.status(201).send({ username: savedUser.username, role: savedUser.role });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// API endpoint to get a list of all users (admin only)
router.get('/', (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  userModel
    .find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

// API endpoint to get a user by username
router.get('/:username', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('You are not logged in');
  }

  const { username } = req.params;

  userModel
    .findOne({ username })
    .then((user) => {
      if (!user) return res.status(404).send('User not found');
      return res.status(200).send(user);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

module.exports = router;