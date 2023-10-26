const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const authorization = req.get('Authorization');
    if(!authorization){
        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authorization.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'someveryverysupersecret')
    }
    catch(err){
        err.statusCode = 401;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}