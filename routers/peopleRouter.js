// in this file we will define the router for the People
//this will let us to define all the routes of the person in a different file rather then in the index.js file


//----------------------------------------------------------------------------------------------
//--------------------------------------------ALL THE IMPORTS
const express = require('express');
const router = express.Router();
const People = require('../models/peopleSchema');
const passport = require('../authentication/auth')
const bcrypt = require('bcrypt');
const { jwtAuthMiddleware, generateToken } = require('../jwtauthentication/jwt')



//---------------------------------------------------------------------------------------------
// ------------------------------------ALL THE ROUTES WILL DEFINE HERE
//now we are ready to create the routes for the People
//first we will define the post endpoint
router.post('/upload', jwtAuthMiddleware, async (req, res) => {
    try {

        //extracting data form the body of request
        const data = req.body;
        //first we create a new People of People type and save the data to the new people
        const newPeople = new People(data);

        //saving data to the database
        const response = await newPeople.save();

        console.log('data saved successfully to People schema');
        res.status(200).json(response);


    } catch (error) {
        console.log('error caught saving People data')
        res.status(500).json({ message: error });
    }
});

//defining route to fetch the data of the People schema
router.get('/data', passport.authenticate('local'), async (req, res) => {
    try {
        //fetching data from database
        const data = await People.find();


        console.log('People data fetched successfylly')
        res.status(200).json(data)

    } catch (error) {
        console.log('error caught in getting People data')
        res.status(500).json({ message: error });
    }
});

//defining parameterised API calls for the people collection
router.get('/data/:gender', passport.authenticate('local'), async (req, res) => {
    try {
        //first we get the value of gender from the request
        const genderfind = req.params.gender;

        //checking whether the gender matches the values available
        if (genderfind == 'male' || genderfind == 'female' || genderfind == 'transgender' || genderfind == 'other') {
            const response = await People.find({ gender: genderfind });
            console.log(`data found for ${genderfind} in a people collection`);
            res.status(200).json(response);
        }
        else {
            console.log('gender not matched34');
            res.status(404).json({ message: 'provide a valid gender34' });
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



        //these 4-5 lines of code is hashed the password when the data of the people is updated
        //extracting data of the people from req body with password
        const { password, ...otherUpdates } = req.body;
        //assigning otherUpdates to updates
        let updates = otherUpdates;
        // console.log(updates, password);
        //hashing the password using the hashPassword function from PeopleSchema
        if (password) {
            const hashedPassword = await People.hashPassword(password);
            updates = { ...otherUpdates, password: hashedPassword };
        }



        //now we update the data of the people
        const response = await People.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (response) {
            console.log(`data updated successfully for ${req.params.id} in people collection`);
            res.status(200).json(response);
        }
        else {
            console.log('provide a valid ID');
            res.status(400).json({ message: 'Invalid Id' });
        }
    } catch (error) {
        console.log('error updating people data');
        res.status(500).json({ message: error });
    }
});


// Route to delete a person by ID
router.delete('/delete/:id', jwtAuthMiddleware, async (req, res) => {
    try {

        const people = await People.findByIdAndDelete(req.params.id);
        if (!people) return res.status(404).json({ message: 'people not found' });
        res.status(200).json({ message: 'People deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//router for the login which will provide the token to the user
router.post('/login', async (req, res) => {

    try {
        //extracting username and password from reques.body
        //most important "username" and "password" must be provided in the body of the request in json format
        const { username, password } = req.body;
        // console.log({username, password});

        //finding user
        const user = await People.findOne({ username });
        // console.log({user});

        if (!user) return res.status(404).json({ error: 'Invalid Username' });

        // console.log(password, user.password);
        // checking the password using the bcrypt compare function
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect Password' });

        // if password is matched then payload is created
        const payload = {
            id: user.id,
            username: user.username
        };

        //generate token is called from jwt.js for token creation
        const token = generateToken(payload);
        res.status(200).json({ token: token });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    };

});

//route to access the particular profile 
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        //jwtAuthMiddleware will provide the decoded user data in the req.user
        const userData = req.user;

        // extracting id of the user
        const userId = userData.id;
        const user = await People.findById(userId);

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


// now we have to export the router
module.exports = router;