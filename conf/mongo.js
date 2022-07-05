const db = {};

db.connect = (uri) => {
    const mongoose = require('mongoose');

    mongoose.Promise = global.Promise;

    mongoose.connect(uri, { useNewUrlParser: true });

    mongoose.connection.on('connected', () => {
        console.log('Server connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
        console.log('Connection error: ' + error);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Server disconnected from MongoDB');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(()=>{
            console.log('Connection closed from application close.');
            process.exit(0);
        });
    });
}
    
module.exports = db;