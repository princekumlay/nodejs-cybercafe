// in this file we will define the router for theCustomer
//this will let us to define all the routes of the person in a different file rather then in the index.js file

const express = require('express');
const router = express.Router();
const Customer = require('../models/customerSchema');

//now we are ready to create the routes for theCustomer
//first we will define the post endpoint
router.post('/', async (req, res) => {
    try {

        //extracting data form the body of request
        const data = req.body;
        //first we create a newCustomer of Customer type and save the data to the newCustomer
        const newCustomer = new Customer(data);

        //saving data to the database
        const response = await newCustomer.save();

        console.log('data saved successfully to Customer schema');
        res.status(200).json(response);


    } catch (error) {
        console.log('error caught savingCustomer data')
        res.status(400).json({ message: error.message });
    }
});

//defining route to fetch the data of theCustomer schema
router.get('/', async (req, res) => {
    try {
        //fetching data from database
        const data = await Customer.find();

        
            console.log('Customer data fetched successfylly')
             res.status(200).json(data)
    
          
    } catch (error) {
        console.log('error caught in getting Customer data')
        res.status(400).json({ message: error.message });
    }
});


//defining parameterised API calls for the people collection
router.get('/:gender', async(req, res) => {
    try {
        //first we get the value of gender from the request
        const genderfind = req.params.gender;

        //checking whether the gender matches the values available
        if(genderfind == 'male' || genderfind == 'female' || genderfind == 'other'){
            const response = await Customer.find({gender: genderfind});
            console.log(`data found for ${genderfind} in a customer collection`);
            res.status(200).json(response);
        }
        else{
            console.log('gender not matched');
            res.status(400).json({message: 'provide a valid gender'});
        }
    } catch (error) {
        console.log('error caught in gender oriented data');
        res.status(500).json({message: error});
    };
});


//let define a end point to updata the data of the people using unique id
//for updating data we need put request
router.put('/:id', async(req, res) => {
    try {

        //now we update the data of the customer
        const response = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators: true
        });
        
        if(!response){
            console.log('provide a valid ID');
            return res.status(400).json({message: 'Invalid Id'});
           
        }
        
            console.log(`data updated successfully for ${req.params.id} in customer collection`);
            res.status(200).json(response);

    } catch (error) {
        console.log('error updating customer data');
        res.status(500).json({message: error.message});
    }
});




//defining a delete endpoint for the people collection
//for deleting data of the people we need delete request
router.delete('/:id', async(req, res) => {
    try {
        //first extract the id
        const customerId = req.params.id;

        //deleting customer data
        const response = await Customer.findByIdAndDelete(customerId);

        if(!response){
            console.log('data not found corresponding to the ID');
            res.status(404).json({message: 'provide a valid Id'});
        }
        else{
            console.log(`data deleted successfully for ${customerId} from customer collection`);
            res.status(200).json(response);
        }
    } catch (error) {
        console.log('error caught deleting data from customer collection');
        res.status(500).json({message: error});
    }
});


// now we have to export the router
module.exports = router;