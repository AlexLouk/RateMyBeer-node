const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");

const authMiddleware = require('../middlewares/AuthMiddleware');

router.use(cors());
router.use(express.json());

router.use(authMiddleware)

router.post('/password', (req, res) => {
    const requestData = {...req.body}
    const newPassword = crypto.createHash('md5').update(requestData.new).digest('hex');
    
    knex('rmb.user')
        .where({user_email: req.decodedToken.user_email})
        .first()
        .then((result) => {
            if (!result) return res.status(404).json({error: "User not found"})
            const hashed_user_password = crypto.createHash('md5').update(requestData.current).digest('hex');
            if (result.user_password == hashed_user_password) {
                knex("rmb.user")
                    .where({user_id: req.decodedToken.user_id})
                    .update({ user_password: newPassword })
                    .then(() => {
                        return res.json({message: "Password updated"})
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).json({ error: error.message });
                    });
            } else {
                return res.status(403).json({error: "Incorrect Password"});
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.post('/username', (req, res) => {
    const requestData = {...req.body}

    knex("rmb.user")
        .where({user_id: req.decodedToken.user_id})
        .update({ user_name: requestData.user_name })
        .then(() => {
            return res.json({message: "Username updated"})
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;
