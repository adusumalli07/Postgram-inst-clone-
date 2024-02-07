const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next){
    
    //Get Auth Token Value
    const authToken = req.headers['authorization'];  
    
    //check if authToken is undefined
    if(typeof authToken !== 'undefined'){

        req.token = authToken;
        const tokenDetails = jwt.verify(authToken,process.env.JWT_KEY);
        req.userId=tokenDetails.userId;
        next();
    } else {
        res.sendStatus(403).json({ StatusCode: "403", message: "Forbidden"});
    }
}