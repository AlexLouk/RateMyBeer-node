global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');
const router = require('../FAQs');

import { login, timeBetweenTests } from '../../../scripts/testHelper';

const app = express();
app.use(express.json());
app.use(router);

describe('FAQsRouter', () => {    
    it('sollte alle FAQs abrufen', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(app).get('/');

        expect(response.body).toEqual(expect.any(Array));

        // Führe hier weitere Assertions durch, um sicherzustellen,
        // dass die erwarteten FAQs in der Antwort enthalten sind.
    }, 15000);

    it('sollte FAQs speichern (admin erforderlich)', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const { token } = await login()
        
        const faqs = [
            { faq_id: 1, faq_title: 'Frage 1', faq_text: 'Antwort 1' },
            { faq_id: 2, faq_title: 'Frage 2', faq_text: 'Antwort 2' },
            // Weitere FAQs hier
        ];

        const response = await request(app)
            .post('/save')
            .send({ faqs })
            .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
        // Führe hier weitere Assertions durch, um sicherzustellen,
        // dass die FAQs erfolgreich gespeichert wurden.
    }, 15000);
});
