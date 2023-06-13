const jwtVerify = require("../../scripts/jwtVerify")

const AuthMiddleware = (req, res, next) => {
    const jwtToken = req.headers.authorization.split(" ")[1]
    const [tokenValid, decodedToken] = jwtVerify(jwtToken)
    
    console.log("Authentication:", tokenValid)
    
    if (tokenValid) req.decodedToken = decodedToken
    else return res.status(401).json({error: "Unauthorized"})
    
    next()
}

module.exports = AuthMiddleware