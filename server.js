require('dotenv').config();

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3000;

const uri = process.env.MONGO_CONNECT_STR;

// Middleware for parsing JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

let db;

async function initializeServer() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        console.log("Connected successfully to MongoDB");

        db = client.db("library");

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });

        app.get('/', (req, res) => {
            res.send('Hello, MongoDB Library!');
        });

        app.get('/books', (req, res) => {
            db.collection('books').find().toArray((err, books) => {
                if (err) {
                    res.status(500).send('Error fetching books.');
                    return;
                }
                res.json(books);
            });
        });

        app.post('/books', (req, res) => {
            const newBook = {
                title: req.body.title,
                author: req.body.author,
            };

            db.collection('books').insertOne(newBook, (err, result) => {
                if (err) {
                    res.status(500).send('Failed to add book.');
                    return;
                }
                res.status(201).send(result.ops[0]);
            });
        });

    } catch (err) {
        console.error('Failed to connect to the database.', err);
        process.exit(1);
    }
}

initializeServer().catch(console.error);