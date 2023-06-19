global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');
const router = require('../FAQs');

const app = express();
app.use(express.json());
app.use(router);

describe('FAQsRouter', () => {
    it('sollte alle FAQs abrufen', async () => {
        const response = await request(app).get('/');


        // Führe hier weitere Assertions durch, um sicherzustellen,
        // dass die erwarteten FAQs in der Antwort enthalten sind.
    });

    it('sollte FAQs speichern (admin erforderlich)', async () => {
        const faqs = [
            { question: 'Frage 1', answer: 'Antwort 1' },
            { question: 'Frage 2', answer: 'Antwort 2' },
            // Weitere FAQs hier
        ];

        const response = await request(app)
            .post('/save')
            .send({ faqs })
            .set('Authorization', 'Bearer your-auth-token');


        // Führe hier weitere Assertions durch, um sicherzustellen,
        // dass die FAQs erfolgreich gespeichert wurden.
    });
});
