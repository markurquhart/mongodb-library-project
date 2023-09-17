require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_CONNECT_STR;

async function testInsert() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('library');
        const result = await db.collection('books').insertOne({ title: 'Test book standalone', author: 'Standalone Author' });
        
        if (result && result.acknowledged) {
            console.log(`Document successfully inserted with ID: ${result.insertedId}`);
        } else {
            console.warn('Document might not have been inserted.');
        }
    } catch (error) {
        console.error('Error inserting document:', error);
    } finally {
        await client.close();
    }
}

testInsert();
