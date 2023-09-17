require('dotenv').config();

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 3000;

const uri = process.env.MONGO_CONNECT_STR;
console.log(uri)
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    if (err) {
        console.error('Failed to connect to the database.', err);
        process.exit(1);
    }

    console.log("Connected successfully to MongoDB");
    db = client.db("library");

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
});

app.get('/', (req, res) => {
    res.send('Hello, MongoDB Library!');
});
