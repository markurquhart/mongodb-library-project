require('dotenv').config();

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;

const uri = process.env.MONGO_CONNECT_STR;

// Use the CORS middleware
app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

let db;

async function initializeServer() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully to MongoDB");

        db = client.db("library");

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });

        app.get('/', (req, res) => {
            console.log("Root route hit!");
            res.send('Hello, MongoDB Library!');
        });

        app.get('/books', async (req, res) => {
            console.log("Fetching books...");
            try {
                const books = await db.collection('books').find().toArray();
                console.log("Books fetched:", books);
                res.json(books);
            } catch (err) {
                console.error("Error fetching books:", err);
                res.status(500).send('Error fetching books.');
            }
        });

        app.delete('/books/:id', async (req, res) => {
            const bookId = req.params.id;
        
            try {
                // Change the conversion to use ObjectId
                const result = await db.collection('books').deleteOne({ _id: new ObjectId(bookId) });
        
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: "Book deleted successfully." });
                } else {
                    console.error("No book found with this ID:", bookId);
                    res.status(404).json({ error: "No book found with this ID." });
                }
        
            } catch (error) {
                console.error("Error deleting book:", error);
                res.status(500).json({ error: "Failed to delete book." });
            }
        });

        app.post('/books', async (req, res) => {
            console.log("Trying to add a book:", req.body);
            const newBook = {
                title: req.body.title,
                author: req.body.author,
            };

            try {
                const result = await db.collection('books').insertOne(newBook);

                console.log("Insertion result:", result);

                if (result && result.acknowledged) {
                    const addedBook = { _id: result.insertedId, title: newBook.title, author: newBook.author };
                    console.log("Book successfully added:", addedBook);
                    res.status(201).send(addedBook);
                } else {
                    console.error("Unexpected result structure:", result);
                    res.status(500).send('Unexpected result after book insertion.');
                }
            } catch (error) {
                console.error("Error during insertion:", error);
                res.status(500).send('Failed to add book.');
            }
        });

    } catch (err) {
        console.error('Failed to connect to the database.', err);
        process.exit(1);
    }
}

initializeServer().catch(console.error);
