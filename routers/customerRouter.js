// in this file we will define the router for theCustomer
//this will let us to define all the routes of the person in a different file rather then in the index.js file


//--------------------------------------------- IMPORTS
const express = require('express');
const router = express.Router();
const Customer = require('../models/customerSchema');
const passport = require('../authentication/auth');
const bcrypt = require('bcrypt');
const { jwtAuthMiddleware, generateToken } = require('../jwtauthentication/jwt')



//------------------------------------------------------ ALL ROUTES
//now we are ready to create the routes for theCustomer
//first we will define the post endpoint
router.post('/upload', jwtAuthMiddleware, async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
});

//defining route to fetch the data of theCustomer schema
router.get('/data', passport.authenticate('local'), async (req, res) => {
    try {
        //fetching data from database
        const data = await Customer.find();

        console.log('Customer data fetched successfully')
        res.status(200).json(data)


    } catch (error) {
        console.log('error caught in getting Customer data')
        res.status(500).json({ message: error.message });
    }
});


//defining parameterised API calls for the people collection
router.get('/data/:gender', passport.authenticate('local'), async (req, res) => {
    try {
        //first we get the value of gender from the request
        const genderfind = req.params.gender;

        //checking whether the gender matches the values available
        if (genderfind == 'male' || genderfind == 'female' || genderfind == 'other') {
            const response = await Customer.find({ gender: genderfind });
            console.log(`data found for ${genderfind} in a customer collection`);
            res.status(200).json(response);
        }
        else {
            console.log('gender not matched');
            res.status(401).json({ message: 'provide a valid gender' });
        }
    } catch (error) {
        console.log('error caught in gender oriented data');
        res.status(500).json({ message: error });
    };
});


//let define a end point to updata the data of the people using unique id
//for updating data we need put request
router.put('/update/:id', jwtAuthMiddleware, async (req, res) => {
    try {




        // THESE 4-5 LINE TO HASHED THE PASSWORD WHEN DATA IS UPDATED
        //extracting the password and other updates from the body
        const { password, ...otherUpdates } = req.body;
        //assign updates with otherUpdates
        let updates = otherUpdates;
        //hashing the password and stored in the updates using the hashed function from customerSchema
        if (password) {
            const hashedPassword = await Customer.hashPassword(password);
            updates = { ...otherUpdates, password: hashedPassword };
        }




        //now we update the data of the customer
        const response = await Customer.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (!response) {
            console.log('provide a valid ID');
            return res.status(404).json({ message: 'Invalid Id' });

        }

        console.log(`data updated successfully for ${req.params.id} in customer collection`);
        res.status(200).json(response);

    } catch (error) {
        console.log('error updating customer data');
        res.status(500).json({ message: error.message });
    }
});




//route to delete the customer data
router.delete('/delete/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        //checking customer is found or not
        if (!customer) return res.status(404).json({ message: 'customer not found' });

        res.status(200).json('customer data deleted successfully' + { customer });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});



// router for the login which will provide the token to the user
router.post('/login', async (req, res) => {
    try {
        // Debugging: Log the entire request body
        // console.log('Request body:', req.body);

        // Extract username and password from request body
        const { username, password } = req.body;

        // Debugging: Log the extracted username and password
        // console.log('Extracted username:', username);
        // console.log('Extracted password:', password);

        // finding user
        const user = await Customer.findOne({ username });
        // console.log('Found user:', user);

        if (!user) return res.status(401).json({ error: 'Invalid Username' });

        //checking for the password matach using bcrypt compare function
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect Password' });

        // if password match then created a payload
        const payload = {
            id: user.id,
            username: user.username
        };

        //called generateToken function for token
        const token = generateToken(payload);
        res.status(200).json({ token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});


//route to access the particular profile 
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        //jwtAuthMiddleware will provide the decoded user data in the req.user
        const userData = req.user;

        // extracting id of the user
        const userId = userData.id;
        const user = await Customer.findById(userId);

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


// ---------------------------------- EXPORTS
// now we have to export the router
module.exports = router;