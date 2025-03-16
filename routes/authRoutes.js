const express = require('express');
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');

const router = express.Router();

// Route for user sign-up
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route to fetch all users (contacts) except the current user
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id mobile name profilePicture');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = router;