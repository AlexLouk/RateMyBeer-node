global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');

import { login, timeBetweenTests } from '../../../scripts/testHelper';

const router = require('../Beers');
const app = express();
app.use(express.json());
app.use(router);

const ratingRouter = require('../Rating');
const ratingApp = express();
ratingApp.use(express.json());
ratingApp.use(ratingRouter);

describe('BeersRouter', () => {    
    var token
    var beersList
    var insertedBeerId

    it('should give a list of all beers', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(app)
            .get('/')
            .send()

        beersList = response.body

        expect(response.body).toEqual(expect.any(Array))
    }, 15000);

    it('should give search results', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(app)
            .get('/search/b')
            .send()

        expect(response.body).toEqual(expect.any(Array))
    }, 15000);

    it('should give details of a beer', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(app)
            .get('/view/' + beersList[0].beer_id)
            .send()

        expect(response.body.beer_id).toEqual(beersList[0].beer_id)
    }, 15000);
    

    it('should add a beer', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        token = (await login()).token
        
        const beerToInsert = {
            beer_name: "Test beer name",
            beer_image: "https://beer.com/image/"
        }
        
        let response = await request(app)
            .post('/add')
            .set("Authorization", `Bearer ${token}`)
            .send(beerToInsert)

        const newBeerId = response.body.beer_id
        insertedBeerId = newBeerId

        // Beer is now added.
        response = await request(app)
            .get('/view/' + newBeerId)
            .send()

        expect(response.body).toHaveProperty('beer_id')
    }, 15000);

    
    it('should approve a beer', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))

        let response = await request(app)
            .post('/approve')
            .send({beer_id: insertedBeerId})
            .set("Authorization", `Bearer ${token}`)

        response = await request(app)
            .get('/view/' + insertedBeerId)
            .send()

        expect(response.body.is_approved).toBeTruthy()
    }, 15000)

    it('should post a review on a beer', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))

        const ratingData = {
            rating_title: "test rating",
            rating_text: "rating test",
            rating_rate: 5,
        }
        
        let response = await request(ratingApp)
            .post('/submit')
            .send({
                beer_id: insertedBeerId,
                rating: ratingData
            })
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
    }, 15000)

    it('should give a list of all reviews on a beer', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        let response = await request(ratingApp)
            .get('/' + insertedBeerId)
            .send()

        expect(response.body).toEqual(expect.any(Array))
    }, 15000)

   
    it('should delete a beer', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        let response = await request(app)
            .delete('/delete')
            .send({beer_id: insertedBeerId})
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
    }, 15000)
});
