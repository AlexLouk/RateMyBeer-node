const express = require('express');
const router = express.Router();
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");

router.use(cors());
router.use(express.json());

//Alle User aus der Datenbank abfragen
router.get("/getAllUsers", (req, res) => {
    knex.select().from("rmb.user").then(rows => {
        res.json(rows);
    })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

//Einen user in der Datenbank anlegen
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
            const maxUserId = result[0].max || 0; 
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

//Einen user aus der Datenbank löschen
router.delete('/deleteUser/:user_name', (req, res) => {
    const username = req.params.user_name;
  
    console.log(username);

    knex('rmb.user')
      .where({ user_name: username })
      .del()
      .then(() => {
        res.status(200).json({ message: 'Benutzer erfolgreich gelöscht', user_name: username });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

module.exports = router;
