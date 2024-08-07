// JWT transmits information between parties in the json object format
// it contains three part "header", "payload" and "signature"
// it does not stores the session information
// header -> contains the type and algorithm, payload -> contains information about user
// and signature -> verifies the integrity and ensures that tokes does not tempered
// written as "header.payload.signature"
// JWT contains two function "jwt.sign()" -> it generates the new jwt token. it takes three parameters (payload, secretOrPrivateKey, options)
// and "jwt.verify()" -> it verifies the user. It takes three parameters (token, secretOrPrivateKey, options)
//---------------------------------------------------------------------- IMPORTS
const jwt = require('jsonwebtoken');
require('dotenv').config();



// now we will define jwt middleware
const jwtAuthMiddleware = async (req, res, next) => {

    //first we will look for thn authorization
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: "token not found" });

    //extracting token from request header
    const token = await req.headers.authorization.split(' ')[1];

    if (!token) return res.status(404).json({ error: 'Unauthorised' });

    try {
        //if token found then decoded
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decoded);

        //attaching user info to req object
        req.user = decoded //in place of user we can name it anything

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Invalid Token" });
    }
};

//defining function which will generate the token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET_KEY);
}

module.exports = { jwtAuthMiddleware, generateToken };