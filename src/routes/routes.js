const express = require('express');
const router = express.Router();

// Home-Seite
router.get('/', (req, res) => {
  res.send('<h1>Birds home page</h1>');
});

// About-Seite

// FAQs-Seite
router.get('/FAQs', (req, res) => {
  res.send('About birds');
});

// Login-Seite
router.get('/login', (req, res) => {
  res.send('About birds');
});

// Rating-Seite
router.get('/rating', (req, res) => {
  res.send('About birds');
});

// User-Seite
router.get('/user', (req, res) => {
  res.send('About birds');
});

//Game




module.exports = router;
