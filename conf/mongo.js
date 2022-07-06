const mongoose = require('mongoose');

const db = {};

db.connect = (uri) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(uri, { 
        useNewUrlParser: true,
        authSource: process.env.DB_AUTH_SOURCE,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS 
    });

    mongoose.connection.on('connected', () => {
        console.log('Server connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
        console.log('Connection error: ' + error);
    });
}

db.disconnect = () => {
    mongoose.connection.close();
}   
    
module.exports = db;