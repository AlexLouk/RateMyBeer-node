const jwt = require("jsonwebtoken")
require('dotenv').config({ path: '../.env' });

const jwtVerify = (clientToken) => {
    var tokenValid
    var decodedToken
    try {
        decodedToken = jwt.verify(clientToken, process.env.JWT_SECRET)        
        tokenValid = true
    } catch(error) {
        decodedToken = error
        tokenValid = false
    }
    
    return [tokenValid, decodedToken]
}


module.exports = jwtVerify