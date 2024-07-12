// in this file we will define the schema for the customer
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customerId : {
        type : Number,
        require : true,
        unique : true
    },
    name : {
        type : String,
        require : true,
        maxlength : 20
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String, 
        enum: ['male', 'female', 'other']
    }
});

//creating model
const Customer = mongoose.model('Customer', CustomerSchema);

//export model
module.exports = Customer;