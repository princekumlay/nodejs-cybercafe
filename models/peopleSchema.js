//in this file we will define the people schema
const mongoose = require('mongoose');

//here we will define schema
const PeopleSchema = new mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number,
        min: 0
    },
    email: {
        type: String,
        require: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'transgender', 'other']
    },
    address: {
        type: String,
    }
});

// creating Person model for the person schema
const People = mongoose.model('People', PeopleSchema);

//now we will export the model
module.exports = People;