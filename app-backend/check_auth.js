let cfg = require('./config.json'); 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Token looks like this: "Bearer <token>"
        const info = jwt.verify(token, cfg.auth.jwt_key);
        req.userData = info;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Authentication failed" }); // TODO: replace with your code
    };
}

