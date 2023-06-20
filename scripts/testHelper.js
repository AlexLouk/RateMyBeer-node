global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
const express = require('express');
const router = require('../src/routes/Login');
const fs = require('fs')

const app = express();
app.use(express.json());
app.use(router);

const timeBetweenTests = 1000
var responseBody

fs.readFile('./token.json', "utf8", (err, data) => {
    if (err) {
        console.error(err)
        responseBody = false
    } else {
        responseBody = JSON.parse(data)
    }
})

const login = async (em, pw) => {
    if ((typeof responseBody == 'object') && (!em && !pw)) {
        return responseBody
    }
console.log("Obtaining auth token...")

    await new Promise(resolve => setTimeout(resolve, timeBetweenTests))

    const user_email = em || 'thomas@gmail.com'
    const user_password = pw || 'thomas'
    
    const response = await request(app)
        .post('/')
        .send({user_email, user_password})

    if (!em && !pw && !response.body.error) {
console.log("Writing token to file...", response.body)
        fs.writeFile('./token.json', JSON.stringify(response.body), (err) => err && console.error(err))
    }
    responseBody = response.body

    return response.body
}

module.exports = {
    login,
    timeBetweenTests
}