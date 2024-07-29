//in this file we will define the people schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//here we will define schema
const PeopleSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    age: {
        type: Number,
        min: 0
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'transgender', 'other']
    },
    address: {
        type: String,
    }
});



//pre hook to hashed the password of the new people or if password is modified
//"this" refers to the people for which query made
PeopleSchema.pre('save', async function(next) {
    console.log('pre hook activated');

    //checing for modification in password 
    if(!this.isModified('password') || !this.isNew) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next();
    }
})




// creating Person model for the person schema
const People = mongoose.model('People', PeopleSchema);

//now we will export the model
module.exports = People;