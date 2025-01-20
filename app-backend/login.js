let cfg = require('./config.json')
const express = require('express');
const router = express.Router();

const pool = require('./pool.js');

const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {

    let user = req.body.user;
    let pass = req.body.pass;
    
    const query = 'SELECT * FROM users WHERE login = $1 AND password = $2';
    const values = [user, pass]; 
    
    pool.query(query, values)
        .then (results => {

            if (results.rows.length == 0) {
                res.status(400).send({ message: 'Login failed, please check your username and password.'})
            }

            resultUser = results.rows[0];
            
            const token = jwt.sign({ user: resultUser.login }, cfg.auth.jwt_key, { expiresIn: cfg.auth.expiration });

			res.status(200).json({
                "message": "Login successful.",
                login: resultUser.login,
                token: token // Include the generated token in the response
            });

        })
        .catch(error => {
            res.status(400).send({ message: 'Login failed, please check your username and password.'})
        });

});

module.exports = router;
