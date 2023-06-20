global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');
const router = require('../News');

import { login, timeBetweenTests } from '../../../scripts/testHelper';

const app = express();
app.use(express.json());
app.use(router);

describe('NewsRouter', () => {    
    var token
    var newsList
    var insertedNewsId
    
    it('should get all the news', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))

        const response = await request(app)
        .get('/')
        .send()
        
        newsList = response.body
        
        expect(response.body).toEqual(expect.any(Array))
    }, 15000);

    it('should search all the news according to given query', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(app)
        .get('/search/a')
        .send()
        
        expect(response.body).toEqual(expect.any(Array))
    }, 15000);

    
    it('should get all the comments of a news', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(app)
        .get(`/${newsList[0].news_id}/comments`)
        .send()
        
        expect(response.body).toEqual(expect.any(Array))
    }, 15000);

    
    it('should submit a news', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        token = (await login()).token
        
        const newsData = {
            news_title: 'Test news title',
            news_date: '2023-06-14T19:00:00.000Z',
            news_text: 'test news description',
            news_image: 'https://test.news.com/image.png',
        }
        
        const response = await request(app)
        .post('/submit')
        .set("Authorization", `Bearer ${token}`)
        .send(newsData)
        
        insertedNewsId = response.body.news_id
        
        expect(response.statusCode).toBe(200)
    }, 15000);

    it('should post a commment for the news', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const commentData = {
            comment_text: "test comment",
            news_id: insertedNewsId
        }

        const response = await request(app)
            .post('/comment')
            .set("Authorization", `Bearer ${token}`)
            .send(commentData)

        expect(response.statusCode).toBe(200)
    }, 15000);

    it('should like a news', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(app)
            .post('/like')
            .set("Authorization", `Bearer ${token}`)
            .send({news_id: insertedNewsId})

        expect(response.statusCode).toBe(200)

        await request(app)
            .post('/like')
            .set("Authorization", `Bearer ${token}`)
            .send({news_id: insertedNewsId})
    }, 15000);
});
