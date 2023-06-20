const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");

const authMiddleware = require('../middlewares/AuthMiddleware');

router.use(cors());
router.use(express.json());

router.use('/add', authMiddleware)
router.use('/delete', authMiddleware)
router.use('/approve', authMiddleware)

router.get('/:user_id?', (req, res) => {
    const userIdMatch = req.params.user_id ? { user_id_fkey: req.params.user_id } : {}
    const approved = req.query.approved == "true"


    knex('rmb.user_beer')
        .where(userIdMatch)
        .then((result) => {
            const beer_ids_joined = result.map(a => a.beer_id_fkey).join(", ")
            if (beer_ids_joined.length == 0) return res.send([])

            knex("rmb.beer")
                .whereRaw(`beer_id IN (${beer_ids_joined})`)
                .where(approved ? { is_approved: true } : {})
                .orderBy('beer_id', 'desc')
                .then((result) => {
                    res.send(result)
                })
                .catch(() => {
                    res.status(500).send({ error: error.message })
                })
        })
        .catch((error) => {
            res.status(500).json({ error: error.message })
        })
})

router.get('/search/:search_query', (req, res) => {
    const searchQuery = `%${req.params.search_query}%`

    knex('rmb.beer')
        .whereRaw(`LOWER(beer_name) like LOWER(?)`, [`%${searchQuery}%`])
        .where({ is_approved: true })
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json({ error: error.message })
        })
})

router.get('/view/:beer_id', (req, res) => {
    const beerId = req.params.beer_id

    knex('rmb.beer')
        .where({ beer_id: beerId })
        .first()
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.status(500).json({ error: error.message })
        })
})

router.post("/add", (req, res) => {
    const beerData = {
        beer_name: req.body.beer_name,
        beer_image: req.body.beer_image
    }

    knex('rmb.beer')
        .orderBy('beer_id', 'desc')
        .first()
        .then((result) => {
            const next_beer_id = result.beer_id + 1
            const beerToInsert = {
                ...beerData,
                beer_id: next_beer_id
            }

            // console.log({
            //     beer_id_fkey: next_beer_id,
            //     user_id_fkey: req.decodedToken.user_id
            // })

            knex('rmb.beer')
                .insert(beerToInsert)
                .then(() => {
                    knex('rmb.user_beer')
                        .insert({
                            beer_id_fkey: next_beer_id,
                            user_id_fkey: req.decodedToken.user_id
                        })
                        .then(() => {
                            res.send(beerToInsert)
                        })
                        .catch(() => {
                            res.status(500).send({ error: error.message })
                        })
                })
                .catch(() => {
                    res.status(500).send({ error: error.message })
                })
        })
})

router.delete("/delete", (req, res) => {
    const beer_id = req.body.beer_id

    knex('rmb.rating_beer')
        .where({ beer_id_fkey: beer_id })
        .del()
        .catch((error) => {
            res.status(500).send({ error: error.message })
        })

    knex('rmb.user_beer')
        .where({ beer_id_fkey: beer_id })
        .del()
        .then(() => {
            knex('rmb.beer')
                .where({ beer_id })
                .del()
                .then(() => {
                    res.send({})
                })
                .catch((error) => {
                    res.status(500).send({ error: error.message })
                })
        })
        .catch((error) => {
            res.status(500).send({ error: error.message })
        })
})

router.post("/approve", (req, res) => {
    const beer_id = req.body.beer_id

    knex('rmb.beer')
        .where({ beer_id })
        .update({ is_approved: true })
        .then(() => {
            res.send({})
        })
        .catch((error) => {
            res.status(500).send({ error: error.message })
        })
})


module.exports = router;