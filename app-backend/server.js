let cfg = require('./config.json')

let express = require('express');
let cors = require('cors')
const app = express();
app.use(express.static('public'));
app.use(cors()); 

const pool = require('./pool.js');

let bodyParser = require('body-parser');
app.use(bodyParser.json());

const checkAuth = require('./check_auth');

const loginRoutes = require('./login');

app.use("/login", loginRoutes);

/*
app.get("/products", checkAuth, (req, res) => {
    pool.query('SELECT * from products')
        .then(db => res.status(200).send(db.rows))
        .catch(err => res.status(400).send("Error while fetching data"))
});

app.get("/product/*", checkAuth, (req, res) => {
    let id = req.url.substring(req.url.lastIndexOf('/') + 1);
    const text = 'SELECT * from products WHERE id = $1';
    const values = [id]; //For more parameters ($1, $2, $3...) use [val1, val2, val3...]
    pool.query(text, values)
        .then(db => res.status(200).send(db.rows))
        .catch(err => res.status(400).send("Error while fetching data"))
});*/

app.get("/logout", checkAuth, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(400).send("Logout not successful");
        }
        res.status(200).send("Logout successful");
    });
});

app.post('/register', async (req, res) => {
    const { user, pass, name, mail} = req.body;

    // Check if the user already exists
    const text = 'SELECT * FROM users WHERE login = $1 OR email = $2';
    const values = [user, mail];

    try {
        const userCheckResult = await pool.query(text, values);

        if (userCheckResult.rows.length > 0) {
            return res.status(400).send({ message: 'Username or email already exists.' });
        }

        const text2 = 'INSERT INTO users (login, password, name, email) VALUES ($1, $2, $3, $4)';
        const values2 = [user, pass, name, mail];

        await pool.query(text2, values2);

        return res.status(201).send({ message: 'User  registered successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Oops, something went wrong during the registration. Please try again later.' });
    }
});

// helper endpoint
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';

    pool.query(query)
        .then(results => {
            if (results.rows.length === 0) {
                return res.status(404).send("No users found.");
            }

            return res.status(200).json(results.rows);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send("Error retrieving user data.");
        });
});
  
let port = 8000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
