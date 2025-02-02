let cfg = require('./config.json')

let express = require('express');
let cors = require('cors')
const app = express();
app.use(express.static('public'));
app.use(cors()); 

const pool = require('./pool.js');

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const checkAuth = require('./check_auth');

const loginRoutes = require('./login');

app.use("/login", loginRoutes);

app.get("/logout", checkAuth, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(400).send("Logout not successful");
        }
        res.status(200).send("Logout successful");
    });
});

app.post('/register', async (req, res) => {
    const { user, pass, name, mail, address} = req.body;

    // Check if the user already exists
    const text = 'SELECT * FROM users WHERE login = $1 OR email = $2';
    const values = [user, mail];

    try {
        const userCheckResult = await pool.query(text, values);

        if (userCheckResult.rows.length > 0) {
            return res.status(400).send({ message: 'Username or email already exists.' });
        }

        const text2 = 'INSERT INTO users (login, password, name, email, address) VALUES ($1, $2, $3, $4, $5)';
        const values2 = [user, pass, name, mail, address];

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

// Endpoint to add a new item
app.post('/add-marketitem', async (req, res) => {
    const { title, owner, description, price, address, condition, handover, name, image_url} = req.body;

    // Validate input
    if (!title || !owner || !description || !price || !address || !condition || !handover || !name || !image_url) {
        console.info(title, owner, description, price, address, condition, handover, name, image_url);
        return res.status(400).send({ message: 'All fields are required.' });
    }

    const text = 'INSERT INTO marketitems (title, owner, description, price, address, condition, handover, name, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    const values = [title, owner, description, price, address, condition, handover, name, image_url];

    try {
        await pool.query(text, values);
        return res.status(201).send({ message: 'Item added successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error adding item. Please try again later.' });
    }
});

// Endpoint to get all items
app.get('/marketitems', async (req, res) => {
    const query = 'SELECT * FROM marketitems';

    try {
        const results = await pool.query(query);
        if (results.rows.length === 0) {
            return res.status(404).send("No items found.");
        }
        return res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error retrieving items.");
    }
});

// Endpoint to get a specific product by ID
app.post('/marketitem/id', async (req, res) => {
    const { id } = req.body;
    const text = 'SELECT * FROM marketitems WHERE id = $1';

    const values = [id];

    try {
        const results = await pool.query(text, values);
        if (results.rows.length === 0) {
            return res.status(404).send("Item not found.");
        }
        return res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error retrieving item.");
    }
});

app.post('/add-real-estate', async (req, res) => {
    const { owner, name, address, title, description, price, type, size, rooms, selltype} = req.body;

    // Validate input
    if (!owner || !name || !address || !title || !description || !price || !type || !size || !rooms || !selltype) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    const text = 'INSERT INTO immoitems (owner, name, address, title, description, price, type, size, rooms, selltype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const values = [owner, name, address, title, description, price, type, size, rooms, selltype];

    try {
        await pool.query(text, values);
        return res.status(201).send({ message: 'Item added successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error adding item. Please try again later.' });
    }
});

app.get('/real-estate', async (req, res) => {
    const query = 'SELECT * FROM immoitems';

    try {
        const results = await pool.query(query);
        if (results.rows.length === 0) {
            return res.status(404).send("No items found.");
        }
        return res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error retrieving items.");
    }
});

// Endpoint to get a specific product by ID
app.post('/real-estate/id', async (req, res) => {
    const { id } = req.body;
    const text = 'SELECT * FROM immoitems WHERE id = $1';

    const values = [id];

    try {
        const results = await pool.query(text, values);
        if (results.rows.length === 0) {
            return res.status(404).send("Item not found.");
        }
        return res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error retrieving item.");
    }
});

// Endpoint to create a new chat
app.post('/chats', async (req, res) => {
    const { sender, title, recipient } = req.body;

    if (!sender || !title || !recipient) {
        return res.status(400).send("Sender, title, and recipient are required.");
    }

    const text = 'INSERT INTO chats (sender, title, recipient) VALUES ($1, $2, $3) RETURNING *';
    const values = [sender, title, recipient];

    try {
        const results = await pool.query(text, values);
        return res.status(201).json(results.rows[0]); // Return the newly created chat
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error creating chat.");
    }
});

// Endpoint to get all chats of an user
app.post('/chats/recipient', async (req, res) => {
    const { recipient } = req.body;

    // Validate input
    if (!recipient) {
        return res.status(400).send("Recipient ID is required.");
    }

    const text = 'SELECT * FROM chats WHERE recipient = $1 OR sender = $1;';
    const values = [recipient];

    try {
        const results = await pool.query(text, values);
        return res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error retrieving chats.");
    }
});

// Endpoint to get a chat with the id
app.post('/chat/id', async (req, res) => {
    const { id } = req.body;
    const text = 'SELECT * FROM chats WHERE id = $1';

    const values = [id];

    try {
        const results = await pool.query(text, values);
        if (results.rows.length === 0) {
            return res.status(404).send("Chat not found.");
        }
        return res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error(error); 
        return res.status(500).send("Error retrieving chat.");
    }
});

app.post('/messages/chatId', async (req, res) => {
    const { id } = req.body; // Get the chat ID from the request body
    const text = 'SELECT * FROM messages WHERE chat_id = $1 ORDER BY time ASC'; // SQL query to select messages

    const values = [id]; // Values to be used in the query

    try {
        const results = await pool.query(text, values); // Execute the query
        if (results.rows.length === 0) {
            return res.status(404).send("No messages found for this chat."); // Handle case where no messages are found
        }
        return res.status(200).json(results.rows); // Return the messages
    } catch (error) {
        console.error(error); // Log any errors
        return res.status(500).send("Error retrieving messages."); // Handle server errors
    }
});

app.delete('/delete-chat/chatId/:id', async (req, res) => {
    const { id } = req.params; 

    const deleteMessagesText = 'DELETE FROM messages WHERE chat_id = $1'; 
    const deleteChatText = 'DELETE FROM chats WHERE id = $1 RETURNING *'; 

    const values = [id];

    try {
        await pool.query('BEGIN');

        await pool.query(deleteMessagesText, values);

        const result = await pool.query(deleteChatText, values);
        
        if (result.rowCount === 0) {
            await pool.query('ROLLBACK'); 
            return res.status(404).send("Chat not found.");
        }

        await pool.query('COMMIT'); 
        return res.status(200).json({ message: "Chat and associated messages deleted successfully.", chat: result.rows[0] });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error); 
        return res.status(500).send("Error deleting chat and messages.");
    }
});

// Endpoint to create a new message
app.post('/add-message', async (req, res) => {
    const { chat_id, sender, recipient, text, time } = req.body;

    // Validate input
    if (!chat_id || !sender || !recipient || !text) {
        return res.status(400).send("Chat ID, sender, recipient, and text are required.");
    }

    const query = `
        INSERT INTO messages (chat_id, sender, recipient, text, time)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [chat_id, sender, recipient, text, time];

    try {
        const results = await pool.query(query, values);
        return res.status(201).json(results.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error creating message.");
    }
});


let port = 8000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
