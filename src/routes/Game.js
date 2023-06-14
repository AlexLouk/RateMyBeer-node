const express = require('express');
const router = express.Router();
const cors = require('cors');
const knex = require("../config/db");

router.use(cors());
router.use(express.json());

// Alle Fragen abrufen
router.get('/questions', (req, res) => {
    knex.select().from("rmb.questions")
        .then(rows => {
            res.json(rows);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

// Frage hinzufügen
router.post('/addQuestions', (req, res) => {
    const { question, answers, correctAnswer } = req.body;

    knex('rmb.questions')
        .max('id')
        .then((result) => {
            const maxQuestionId = result[0].max || 0;
            const nextQuestionId = maxQuestionId + 1;

            const newQuestion = {
                id: nextQuestionId,
                question: question,
                answers: answers,
                correctAnswer: correctAnswer
            };

            console.log(newQuestion);

            knex('rmb.questions')
                .insert(newQuestion)
                .then(() => {
                    res.status(201).json({ id: nextQuestionId, message: 'Frage erfolgreich hinzugefügt' });
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
