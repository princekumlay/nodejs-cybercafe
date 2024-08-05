// in this file we will define the schema for the customer
//------------------------------------------- IMPORTS
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//------------------------------------------------ SCHEMAS
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



//------------------------------------- PRE HOOK AND FUNCTION FOR HASHING FUNCTION
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

//function to hashed the password if there is change in the customer data
CustomerSchema.statics.hashPassword = async function(password){
    return bcrypt.hash(password, 10);
}


//---------------------------------------- MODELS
//creating model
const Customer = mongoose.model('Customer', CustomerSchema);


//------------------------------------------------ EXPORTS
//export model
module.exports = Customer;