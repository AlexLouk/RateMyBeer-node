const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");
const AuthMiddleware = require('../middlewares/AuthMiddleware');

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
    if (!req.body.user_password) return res.status(400).json({ error: "Password missing" })
    const hashed_user_password = crypto.createHash('md5').update(req.body.user_password).digest('hex');

    const newUser = {
        user_email: req.body.user_email,
        user_password: hashed_user_password,
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


router.use('/deleteUser/:user_name', AuthMiddleware)

//Einen user aus der Datenbank löschen
router.delete('/deleteUser/:user_name', (req, res) => {
    const username = req.params.user_name;

    knex('rmb.user')
        .where({ user_name: username })
        .first()
        .then((result) => {
            if (!result) return res.status(404).json({ error: "User not found" })
            const hashed_user_password = crypto.createHash('md5').update(req.body.user_password || "").digest('hex');
            if ((result.user_password == hashed_user_password) || req.decodedToken.user_is_admin) {
                knex('rmb.user_rating').where({ user_id_fkey: result.user_id }).del()
                .catch((error) => {res.status(500).send({ error: error.message });})
                
                knex('rmb.user_beer').where({ user_id_fkey: result.user_id }).del()
                .catch((error) => {res.status(500).send({ error: error.message });})
                
                knex('rmb.user').where({ user_name: username }).del().then(() => {res.status(200).json({ message: 'Benutzer erfolgreich gelöscht', user_name: username });})
                .catch((error) => {res.status(500).json({ error: error.message });});
                
            } else {
                return res.status(403).json({ error: "Incorrect Password" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });


});

module.exports = router;
