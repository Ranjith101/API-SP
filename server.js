const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    user: 'sa',
    password: 'Ranjith@123',
    server: 'localhost',
    database: 'my_sp_database',
    options: {
        encrypt: true, // Enable encryption
        trustServerCertificate: true, // Trust self-signed certificates
        enableArithAbort: true
    }
};

sql.connect(dbConfig, err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Create a new user
app.post('/users', (req, res) => {
    const { username, email, age } = req.body;
    const request = new sql.Request();
    request.input('name', sql.NVarChar, username);
    request.input('email', sql.NVarChar, email);
    request.input('age', sql.Int, age);
    request.execute('createUser', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get all users
app.get('/users', (req, res) => {
    const request = new sql.Request();
    request.execute('getUsers', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result.recordset);
        }
    });
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();
    request.input('userId', sql.Int, id);
    request.execute('getUserById', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result.recordset);
        }
    });
});

// Update a user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const request = new sql.Request();
    request.input('userId', sql.Int, id);
    request.input('name', sql.NVarChar, name);
    request.input('email', sql.NVarChar, email);
    request.input('age', sql.Int, age);
    request.execute('updateUser', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const request = new sql.Request();
    request.input('userId', sql.Int, id);
    request.execute('deleteUser', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
