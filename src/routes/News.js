const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });
const knex = require("../config/db");

const authMiddleware = require('../middlewares/AuthMiddleware');
const { error } = require('console');
const jwtVerify = require('../../scripts/jwtVerify');

router.use(cors());
router.use(express.json());

router.use('/submit', authMiddleware)
router.use("/like", authMiddleware)
router.use("/comment", authMiddleware)


router.get('/:news_id?', (req, res) => {
    const newsIdMatch = req.params.news_id ? { news_id: req.params.news_id } : {}
    const [loggedIn, decodedToken] = jwtVerify(req.headers.authorization?.split(" ")[1])


    knex("rmb.news")
        .where(newsIdMatch)
        .orderBy('news_id', 'desc')
        .then(result => {
            const news = result.map(newsItem => {
                return {
                    ...newsItem,
                    news_liked: loggedIn ? (JSON.parse(newsItem.news_likes || "[]").includes(parseInt(decodedToken.user_id))) : false,
                    news_likes: JSON.parse(newsItem.news_likes || "[]")
                }
            })
            return res.send(news)
        })
        .catch((error) => {
            console.error(error)
            return res.status(500).send(error)
        })

})

router.get("/:news_id/comments", (req, res) => {
    const newsId = req.params.news_id
    knex("rmb.news_comment")
        .where({ news_id_fkey: newsId })
        .then(result => {
            const commentIdsList = result.map(a => a.comment_id_fkey).join(", ")
            if (commentIdsList.length == 0) return res.send([])


            knex("rmb.comment")
                .whereRaw(`comment_id IN (${commentIdsList})`)
                .then(commentsResult => {

                    knex("rmb.user_comment")
                        .join("rmb.user", "rmb.user.user_id", "=", "rmb.user_comment.user_id_fkey")
                        .then(commentsUsers => {
                            const comments = commentsResult.map((comment) => {
                                const targetUser = commentsUsers.find(u => u.comment_id_fkey == comment.comment_id)

                                return {
                                    ...comment,
                                    user_name: targetUser.user_name,
                                    user_id: targetUser.user_id
                                }
                            })

                            console.log(comments)
                            res.send(comments)

                        })
                        .catch((error) => {
                            console.error(error)
                            return res.status(500).send(error)
                        })
                })
                .catch((error) => {
                    console.error(error)
                    return res.status(500).send(error)
                })
        })
        .catch((error) => {
            console.error(error)
            return res.status(500).send(error)
        })
})

router.post("/submit", (req, res) => {
    const newsData = req.body

    knex('rmb.news')
        .orderBy('news_id', 'desc')
        .first()
        .then((result) => {
            knex('rmb.news')
                .insert({ ...newsData, news_id: result.news_id + 1, news_likes: "[]" })
                .then(() => {
                    res.send()
                })
                .catch((error) => {
                    res.status(500).send(error)
                    console.error(error)
                })
        })
        .catch((error) => {
            res.status(500).send(error)
            console.error(error)
        })
})

router.post("/comment", (req, res) => {
    const comment_text = req.body.comment_text

    knex('rmb.comment')
        .orderBy('comment_id', 'desc')
        .first()
        .then((result) => {
            const comment_id = result.comment_id + 1
            const news_id = req.body.news_id
            const user_id = req.decodedToken.user_id

            knex('rmb.comment')
                .insert({
                    comment_id,
                    comment_text,
                })
                .then(() => {
                    knex('rmb.news_comment').insert({ comment_id_fkey: comment_id, news_id_fkey: news_id }).catch(error => {
                        console.error(error)
                        res.status(500).send(error)
                    })
                    knex('rmb.user_comment').insert({ comment_id_fkey: comment_id, user_id_fkey: user_id }).catch(error => {
                        console.error(error)
                        res.status(500).send(error)
                    })

                    return res.send()
                })
                .catch((error) => {
                    res.status(500).send(error)
                    console.error(error)
                })
        })
        .catch((error) => {
            res.status(500).send(error)
            console.error(error)
        })
})

router.get('/search/:search_query', (req, res) => {
    const searchQuery = req.params.search_query

    knex('rmb.news')
        .whereRaw("LOWER(news_title) like LOWER(?)", [`%${searchQuery}%`])
        .orWhereRaw("LOWER(news_text) like LOWER(?)", [`%${searchQuery}%`])
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            console.error(error)
            res.status(500).json({ error: error.message })
        })
})

router.post("/like", (req, res) => {
    const news_id = req.body.news_id
    const user_id = req.decodedToken.user_id

    knex('rmb.news')
        .where({ news_id })
        .first()
        .then(targetNews => {
            console.log(targetNews, targetNews.news_likes)
            const currentLikes = JSON.parse(targetNews.news_likes || "[]")
            var newLikes

            if (currentLikes.includes(user_id))
                newLikes = currentLikes.filter(id => user_id != id)
            else
                newLikes = [...currentLikes, user_id]

            knex("rmb.news")
                .where({ news_id })
                .update({ news_likes: JSON.stringify(newLikes) })
                .then(() => {
                    res.send(newLikes)
                })
        })
        .catch((error) => {
            res.status(500).send(error)
            console.error(error)
        })
})

module.exports = router;