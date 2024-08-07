// this file will make the connection with the database
//first we will require mongoose
//----------------------------------------------------------- IMPORTS
const mongoose = require('mongoose');

//this env file contains all the sensitive data like port number and url's
require('dotenv').config();

//------------------------------------------------------------- DATABASE URL's
// const URL = "mongodb://localhost:27017/CyberCafe";
const URL = process.env.LOCALURL;
// const URL = process.env.ONLINEURL;

//now we will establish a connection to the database
//it will initialize the connection but not actually connect to the database
mongoose.connect(URL);

// now we will retrive the default object maintained by the mongoose for the connection and store it in the db variable
const db = mongoose.connection;

//----------------------------------------------------------- EVENT LISTENER
db.on('connected', () => {
    console.log("connected successfully");
});

db.on('error', (err) => {
    console.log("connection error " + err);
});

db.on('disconnected', () => {
    console.log('disconnected');
});

module.exports = db;
