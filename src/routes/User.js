const express = require('express');
const router = express.Router();
const cors = require('cors');
require('dotenv').config({path:'../.env'});
const knex = require("../config/db");

router.use(cors());
router.use(express.json());

router.get("/getAllUsers", (req, res) => {
    knex.select().from("rmb.user").then(rows => {
        // Erfolgreiche Abfrage, sende die Daten als Antwort
        res.json(rows);
      })
      .catch((error) => {
        // Bei einem Fehler, sende eine Fehlermeldung als Antwort
        res.status(500).json({ error: error.message });
      });
  });

  
  router.post('/addUser', (req, res) => {
    const newUser = {
      user_email: req.body.user_email,
      user_password: req.body.user_password,
      user_is_admin: false,
      user_name: req.body.user_name,
    };
  
    knex('rmb.user')
      .max('user_id')
      .then((result) => {
        const maxUserId = result[0].max || 0; // Falls keine Benutzer vorhanden sind, wird 0 als Standardwert verwendet
        const nextUserId = maxUserId + 1;
        newUser.user_id = nextUserId;
  
        knex('rmb.user')
          .insert(newUser)
          .then(() => {
            res.status(201).json({ message: 'Benutzer erfolgreich angelegt', user_id: nextUserId });
          })
          .catch((error) => {
            res.status(500).json({ error: error.message });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
  

  module.exports = router;
