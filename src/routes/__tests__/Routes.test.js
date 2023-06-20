global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');
const router = require('../routes');

import { login, timeBetweenTests } from '../../../scripts/testHelper';

const app = express();
app.use(express.json());
app.use(router);

describe('Routes', () => {    
    it('should load the default route GET:/', async () => {
        const response = await request(app)
            .get("/")
            .send()

        expect(response.statusCode).toBe(200)
    }, 15000);
    
    it('should load the default route GET:/FAQs', async () => {
        const response = await request(app)
            .get("/FAQs")
            .send()

        expect(response.statusCode).toBe(200)
    }, 15000);
    
    it('should load the default route GET:/login', async () => {
        const response = await request(app)
            .get("/login")
            .send()

        expect(response.statusCode).toBe(200)
    }, 15000);

    it('should load the default route GET:/rating', async () => {
        const response = await request(app)
            .get("/rating")
            .send()

        expect(response.statusCode).toBe(200)
    }, 15000);
    
    it('should load the default route GET:/user', async () => {
        const response = await request(app)
            .get("/user")
            .send()

        expect(response.statusCode).toBe(200)
    }, 15000);
});
