// in this file we will define the router for the People
//this will let us to define all the routes of the person in a different file rather then in the index.js file

const express = require('express');
const router = express.Router();
const People = require('../models/peopleSchema');

//now we are ready to create the routes for the People
//first we will define the post endpoint
router.post('/', async (req, res) => {
    try {

        //extracting data form the body of request
        const data = req.body;
        //first we create a new People of People type and save the data to the new people
        const newPeople = new People(data);

        //saving data to the database
        const response = await newPeople.save();

        console.log('data saved successfully to People schema');
        res.json(response);


    } catch (error) {
        console.log('error caught saving People data')
        res.json({ message: error.message });
    }
});

//defining route to fetch the data of the People schema
router.get('/', async (req, res) => {
    try {
        //fetching data from database
        const data = await People.find();


        console.log('People data fetched successfylly')
        res.json(data)

    } catch (error) {
        console.log('error caught in getting People data')
        res.json({ message: error.message });
    }
});

//defining parameterised API calls for the people collection
router.get('/:gender', async(req, res) => {
    try {
        //first we get the value of gender from the request
        const genderfind = req.params.gender;

        //checking whether the gender matches the values available
        if(genderfind == 'male' || genderfind == 'female' || genderfind == 'transgender' || genderfind == 'other'){
            const response = await People.find({gender: genderfind});
            console.log(`data found for ${genderfind} in a people collection`);
            res.json(response);
        }
        else{
            console.log('gender not matched');
            res.json({message: 'provide a valid gender'});
        }
    } catch (error) {
        console.log('error caught in gender oriented data');
        res.json({message: error});
    };
});


//let define a end point to updata the data of the people using unique id
//for updating data we need put request
router.put('/:id', async(req, res) => {
    try {
        //first we extract the id from the request body
        const peopleId = req.params.id;
        //now we extract data from the body of the request
        const data = req.body;

        //now we update the data of the people
        const response = await People.findByIdAndUpdate(peopleId, data);
        
        if(response){
            console.log(`data updated successfully for ${peopleId} in people collection`);
            res.json(response);
        }
        else{
            console.log('provide a valid ID');
            res.json({message: 'Invalid Id'});
        }
    } catch (error) {
        console.log('error updating people data');
        res.json({message: error});
    }
});


//defining a delete endpoint for the people collection
//for deleting data of the people we need delete request
router.delete('/:id', async(req, res) => {
        try {
            //first extract the id
            const peopleId = req.params.id;

            //deleting people data
            const response = await People.findByIdAndDelete(peopleId);

            if(!response){
                console.log('data not found corresponding to the ID');
                res.json({message: 'provide a valid Id'});
            }
            else{
                console.log(`data deleted successfully for ${peopleId} from people collection`);
                res.json(response);
            }
        } catch (error) {
            console.log('error caught deleting data from person collection');
            res.json({message: error});
        }
});

// // Route to delete a person by ID
// router.delete('/:id', async (req, res) => {
//     try {
//       const people = await People.findByIdAndDelete(req.params.id);
//       if (!people) return res.status(404).json({ message: 'people not found' });
//       res.json({ message: 'People deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });


// now we have to export the router
module.exports = router;