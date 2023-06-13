const express = require('express');
const router = express.Router();

const questions = [
    {
        id: 1,
        question: 'Welches Land ist für sein Oktoberfest bekannt?',
        answers: ['Deutschland', 'Frankreich', 'Italien', 'Spanien'],
        correctAnswer: 'Deutschland'
    },
    {
        id: 2,
        question: 'Welche Zutat ist ein Hauptbestandteil von Bier?',
        answers: ['Hopfen', 'Reis', 'Weintrauben', 'Olivenöl'],
        correctAnswer: 'Hopfen'
    }
];

// Alle Fragen abrufen
router.get('/questions', (req, res) => {
    if (questions.length === 0) {
        return res.status(404).json({ error: 'Keine weiteren Fragen verfügbar' });
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    // questions.splice(randomIndex, 1); // Entferne die abgerufene Frage aus der Liste

    res.json([randomQuestion]);
});

// Frage hinzufügen
router.post('/questions', (req, res) => {
    const { question, answers, correctAnswer } = req.body;

    const newQuestion = {
        id: questions.length + 1,
        question,
        answers,
        correctAnswer
    };

    questions.push(newQuestion);

    res.status(201).json({ message: 'Frage erfolgreich hinzugefügt' });
});

module.exports = router;
