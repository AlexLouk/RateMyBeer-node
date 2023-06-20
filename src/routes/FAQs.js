const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");

const authMiddleware = require('../middlewares/AuthMiddleware');

router.use(cors());
router.use(express.json());

router.use('/save', authMiddleware)


router.get('/', (req, res) => {
    knex("rmb.faq")
        .then(faqs => {
            res.send(faqs)
        })
        .catch(error => {
            console.error(error)
            res.status(500).send(error)
        })
})

router.post('/save', (req, res) => {
    if (!req.decodedToken.user_is_admin) return res.status(403).send()

    knex("rmb.faq")
        .truncate()
        .then(() => {
            if (req.body.faqs.length == 0) return res.send({})


            knex("rmb.faq")
                .insert(req.body.faqs)
                .then(result => {
                    res.send(result)
                })
                .catch(error => {
                    console.error(error)
                    res.status(500).send(error)
                })
        })
        .catch(error => {
            console.error(error)
            res.status(500).send(error)
        })
})

module.exports = router;