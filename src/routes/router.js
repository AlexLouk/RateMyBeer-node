const express = require('express')
const router = express.Router()


// define the home page route
router.get('/home', (req, res) => {
    res.send('Birds home page')
  })
  // define the about route
  router.get('/about', (req, res) => {
    res.send('About birds')
  })
  router.get('/FAQs', (req, res) => {
    res.send('About birds')
  })

  router.get('/login', (req, res) => {
    res.send('About birds')
  })

  router.get('/rating', (req, res) => {
    res.send('About birds')
  })

  router.get('/user', (req, res) => {
    res.send('About birds')
  })

  module.exports = router



