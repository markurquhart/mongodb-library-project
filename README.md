# Sample Mongo DB Project
This is a very basic Node project that interacts with a MongoDB Cluster (Cloud version) to store, edit, and delete books and their authors.

## Node Modules
- body-parser@1.20.2
- cors@2.8.5
- dotenv@16.3.1
- express@4.18.2
- mongodb@6.1.0
- mongoose@7.5.2

## MongoDB setup
I setup a basic cluster in Mongo cloud. 
- Version 6.0.10
- Cluster Tier M10 
- Type: Replica Set - 3 Nodes
- Backups Active

## Installation Instructions 
- Install the node modules
- Create an .env file with the mongo connection string 
    - MONGO_CONNECT_STR=<yourstringhere>
- Once that's done, run the below to start the server 

```
node server.js
```
- The site should be loaded on https://localhost:3000 



