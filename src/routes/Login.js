const express = require('express');
const router = express.Router();
const cors = require('cors');
const crypto = require('crypto');
const jwt = require("jsonwebtoken")
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");
const jwtVerify = require('../../scripts/jwtVerify');

router.use(cors());
router.use(express.json());

router.post('/validate', (req, res) => {
    const clientToken = req.body.token
    const [tokenValid, decodedToken] = jwtVerify(clientToken)

    return res.json({ valid: tokenValid, decodedToken, token: clientToken })
})

//Einen user in der Datenbank anlegen
router.post('/', (req, res) => {
    const receivedCredentials = {
        user_email: req.body.user_email,
        user_password: req.body.user_password,
    };

    if (Object.values(receivedCredentials).includes(undefined))
        return res.status(400).json({ error: "Email and password not received" });

    console.log(receivedCredentials);

    knex('rmb.user')
        .where({ user_email: receivedCredentials.user_email })
        .first()
        .then((result) => {
            if (!result) return res.status(404).json({ error: "User not found" })
            const hashed_user_password = crypto.createHash('md5').update(receivedCredentials.user_password).digest('hex');
            if (result.user_password == hashed_user_password) {
                const auth_token = jwt.sign(
                    { user_id: result.user_id, user_email: result.user_email, user_is_admin: result.user_is_admin },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                res.json({
                    user_id: result.user_id,
                    user_name: result.user_name,
                    user_email: result.user_email,
                    user_is_admin: result.user_is_admin,
                    token: auth_token
                });
            } else {
                return res.status(403).json({ error: "Incorrect Password" });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });

    return

});

module.exports = router;
