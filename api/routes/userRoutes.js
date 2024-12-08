const express = require('express');
const jwt = require('jsonwebtoken');
const loadLowdb = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, passwordProvided: !!password });
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await loadLowdb();
    const user = db.data.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const db = await loadLowdb();
    const user = db.data.users.find(u => u._id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user balance
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const db = await loadLowdb();
    const user = db.data.users.find(u => u._id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const db = await loadLowdb();
    const userIndex = db.data.users.findIndex(u => u._id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = db.data.users[userIndex];
    const updatedUser = {
      ...currentUser,
      name: {
        first: req.body.firstName || currentUser.name.first,
        last: req.body.lastName || currentUser.name.last
      },
      phone: req.body.phone || currentUser.phone,
      address: req.body.address || currentUser.address,
      age: req.body.age || currentUser.age,
      eyeColor: req.body.eyeColor || currentUser.eyeColor
    };

    db.data.users[userIndex] = updatedUser;
    await db.write();

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;