//first we will require the express and then create the express app
const express = require('express');
const db = require('./db');
const PeopleRouter = require('./routers/peopleRouter');
const CustomerRouter = require('./routers/customerRouter');

require('dotenv').config();

//************ BODY PARSER IS AN IMPORTANT STEP DO NOT FORGET IT AT ALL */
const bodyParser = require('body-parser');

const app = express();

//THIS STEP WILL CONVERT ANY KIND OF INCOMING DATA IN REQUEST BODY IN JS OBJECT FORMAT
app.use(bodyParser.json());

//now we will define the request of the express app
app.get('/', (req, res) => {
    res.send("Hello nodejs world for the back end developerss");
});

app.use('/people', PeopleRouter);
app.use('/customer', CustomerRouter)


//here we will define the port on which the app will run

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`app is running at http://localhost:${PORT}`);
});

//here we have done of creating an express app which is listening at port 3000