// server/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Validación de usuario (por simplicidad, sin una base de datos)
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ role: 'admin' }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } else if (username === 'client' && password === 'password') {
    const token = jwt.sign({ role: 'client' }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(403).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
