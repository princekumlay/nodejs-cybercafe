// in this file we will define the schema for the customer
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CustomerSchema = new mongoose.Schema({
    customerId : {
        type : Number,
        require : true,
        unique : true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
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


//defining pre hook which will work before the save operation
CustomerSchema.pre('save', async function(next) {
    console.log('pre hook is activated');

    //if password does not manipulated 
    if(!this.isModified('password') || !this.isNew) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }
})


//creating model
const Customer = mongoose.model('Customer', CustomerSchema);

//export model
module.exports = Customer;