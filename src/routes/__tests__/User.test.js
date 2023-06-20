global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');
const loginRouter = require('../Login');
const registerRouter = require('../User');
const updateRouter = require('../Update');

import { login, timeBetweenTests } from '../../../scripts/testHelper';

const loginApp = express();
loginApp.use(express.json());
loginApp.use(loginRouter);

const registerApp = express();
registerApp.use(express.json());
registerApp.use(registerRouter);

const updateApp = express();
updateApp.use(express.json());
updateApp.use(updateRouter);

describe('AuthRouter', () => {    
    var token
    const ranInt = Math.round(Math.random()*15000)
    const newUser = {
        user_email: `testuser@${ranInt}mail.com`,
        user_password: 'testuser',
        user_name: `Test user ${ranInt}`,
    }
    let newUserId

    // --- Login: ---


    it('should give a token upon login', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))

        const loginDetails = await login()
        expect(loginDetails).toHaveProperty('token');

        token = loginDetails.token
    }, 15000);

    it('should not give any token with incorrect credentials', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const loginDetails = await login('thomas@gmail.com', 'incorrectpassword')
        expect(loginDetails).not.toHaveProperty('token');
    }, 15000);

    it('should validate token and decode it', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(loginApp)
            .post('/validate')
            .send({token})

        expect(response.body).toHaveProperty('decodedToken');
    }, 15000);

    // --- Register: ---


    it('should give a list of all users', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))

        const response = await request(registerApp)
            .get('/getAllUsers')
            .send()

        expect(response.body).toEqual(expect.any(Array));
    }, 15000);
    

    it('should register a user', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        let response = await request(registerApp)
            .post('/addUser')
            .send(newUser)
            
        newUserId = response.body.user_id
        response = await request(registerApp)
            .get('/getAllUsers')
            .send()

        const userIdsArray = response.body.map(user => user.user_id)
            
        expect(userIdsArray).toContain(newUserId);
    }, 15000);


    it('should not register a user without password', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(registerApp)
            .post('/addUser')
            .send({})
            
        expect(response.statusCode).toBe(400);
    }, 15000);

    it('should not delete a nonexistent user', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const response = await request(registerApp)
            .delete('/deleteUser/ranusername' + Math.random())
            .send()
            .set("Authorization", `Bearer ${token}`)
        
        expect(response.statusCode).toBe(404);
    }, 30000);


    it('should not delete a user with incorrect password', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        const testUserLogin = await login(newUser.user_email, newUser.user_password)
        
        const response = await request(registerApp)
            .delete('/deleteUser/' + newUser.user_name)
            .send({user_password: "incorrect"})
            .set("Authorization", `Bearer ${testUserLogin.token}`)
        
        expect(response.statusCode).toBe(403);
    }, 30000);

    it('should delete a user', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        setTimeout(async () => {
        let response = await request(registerApp)
            .delete('/deleteUser/' + newUser.user_name)
            .send(newUser)
            
        expect(response.statusCode).toBe(200)
            
        response = await request(registerApp)
            .get('/getAllUsers')
            .send()
            
            const userIdsArray = response.body.map(user => user.user_id)
            
            expect(userIdsArray).not.toContain(newUserId);
        }, 15000);
    }, 30000);


    // --- Update: ---

    
    it('should update the password', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        
        var response = await request(updateApp)
            .post("/password")
            .send({
                new: "newthomas",
                current: "thomas"
            })
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        
        response = await request(updateApp)
            .post("/password")
            .send({
                new: "thomas",
                current: "newthomas"
            })
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

    }, 15000);


    it('should update the username', async () => {
        await new Promise(resolve => setTimeout(resolve, timeBetweenTests))
        
        var response = await request(updateApp)
            .post("/username")
            .send({
                user_name: "newthomas",
            })
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)
        
        response = await request(updateApp)
            .post("/username")
            .send({
                user_name: "thomas",
            })
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toBe(200)

    }, 15000);

});
