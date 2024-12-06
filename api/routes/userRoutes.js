const express = require('express');
const jwt = require('jsonwebtoken');
const loadLowdb = require('../db'); // Import the async loader

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Load the database dynamically
  const db = await loadLowdb();
  const user = db.data.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token, user });
});

// Profile retrieval route
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    const db = await loadLowdb();
    const user = db.data.users.find((u) => u._id === decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
});

// Profile update route
router.put('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    const db = await loadLowdb();
    const user = db.data.users.find((u) => u._id === decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email } = req.body;
    user.name.first = name?.first || user.name.first;
    user.name.last = name?.last || user.name.last;
    user.email = email || user.email;

    await db.write();
    res.json({ message: 'Profile updated successfully', user });
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
});

module.exports = router;
