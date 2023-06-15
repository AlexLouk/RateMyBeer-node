const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");

const authMiddleware = require('../middlewares/AuthMiddleware');

router.use(cors());
router.use(express.json());

router.use('/submit', authMiddleware)


router.get('/:beer_id', (req, res) => {
    const beerId = req.params.beer_id

    knex('rmb.rating_beer')
        .where({ beer_id_fkey: beerId })
        .then((ratingBeerIdsResult) => {
            const rating_ids_joined = ratingBeerIdsResult.map(a => a.rating_id_fkey).join(", ")
            if (rating_ids_joined.length == 0) return res.send([])

            knex('rmb.rating')
                .whereRaw(`rating_id IN (${rating_ids_joined})`)
                .then((ratingsResult) => {
                    knex('rmb.user_rating')
                        .join('rmb.user', 'rmb.user.user_id', '=', 'rmb.user_rating.user_id_fkey')
                        .then(rating_users => {
                            // console.log("ratingsResult", ratingsResult);
                            // console.log("ratingBeerIdsResult", ratingBeerIdsResult);
                            // console.log("rating_users", rating_users);
                            const ratings = ratingsResult.map((rating) => {
                                const targetUser = rating_users.find(u => u.rating_id_fkey == rating.rating_id)

                                return {
                                    ...rating,
                                    user_name: targetUser.user_name,
                                    user_id: targetUser.user_id
                                }
                            })

                            console.log(ratings)
                            res.send(ratings)
                        })
                })
                .catch((error) => {
                    res.status(500).json({ error: error.message })
                })
        })
        .catch((error) => {
            res.status(500).json({ error: error.message })
        })
})

router.post("/submit", (req, res) => {
    const ratingData = req.body.rating
    const beer_id = req.body.beer_id
    const user_id = req.body.user_id

    knex('rmb.rating')
        .orderBy('rating_id', 'desc')
        .first()
        .then(result => {
            const rating_id = result.rating_id + 1
            console.log(rating_id)

            knex('rmb.rating')
                .insert({ ...ratingData, rating_id })
                .then(() => {
                    knex('rmb.rating_beer').insert({ rating_id_fkey: rating_id, beer_id_fkey: beer_id }).catch(error => {
                        res.status(500).send(error)
                        console.error(error)
                    })
                    knex('rmb.user_rating').insert({ rating_id_fkey: rating_id, user_id_fkey: user_id }).catch(error => {
                        res.status(500).send(error)
                        console.error(error)
                    })

                    return res.send()
                })
        })
})

module.exports = router;
