const express = require('express');
const router = express.Router();
const cors = require('cors');
const knex = require("../config/db");

router.use(cors());
router.use(express.json());

// Alle Fragen abrufen
router.get('/questions', (req, res) => {
    knex.select().from("rmb.questions").then(rows => {
        res.json(rows);
    })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});

// Frage hinzufügen
router.post('/addQuestions', (req, res) => {
    const { question, answers, correctAnswer } = req.body;

    knex("rmb.questions")
        .insert({
            question: question,
            answers: JSON.stringify(answers),
            correctAnswer: correctAnswer
        })
        .then(() => {
            res.status(201).json({ message: 'Frage erfolgreich hinzugefügt' });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
});


module.exports = router;