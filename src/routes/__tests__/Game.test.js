global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');
const app = express();
const gameRouter = require('../Game');

import { timeBetweenTests } from '../../../scripts/testHelper';

app.use(express.json());
app.use('/game', gameRouter);

describe('GameRouter', () => {
    it('sollte alle Fragen abrufen und eine Frage hinzufügen', async () => {
        // Alle Fragen abrufen
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))

        const responseGet = await request(app).get('/game/questions');

        // Eine Frage hinzufügen
        const newQuestion = {
            question: 'Wie heißt die Hauptstadt von Frankreich?',
            answers: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctAnswer: 'Paris'
        };

        const responsePost = await request(app).post('/game/addQuestions').send(newQuestion);
    }, 20000);
});
