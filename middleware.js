const jwt = require('jsonwebtoken');


const verifyTokenMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers['authorization'];

    if (token == null) {
        return res.sendStatus(401); // If no token, return 401 (Unauthorized)
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // Invalid token
        }

        // If token is verified, add the decoded information to the request
        req.user = decoded;
        
        next(); // Proceed to the next middleware or route handler
    });
};


module.exports = verifyTokenMiddleware;