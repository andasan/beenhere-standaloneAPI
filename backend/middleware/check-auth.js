const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {

    //required adjustment to make sure OPTIONS request is not blocked
    if(req.method === 'OPTIONS'){
        return next(); //allow this request to continue
    }

    //encoding the token to the request headers
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //validating token
        req.userData = { userId: decodedToken.userId } //dynamically add data
        next();

    } catch (err) {
        return next(new HttpError('Authentication failed!', 403));
    }
}