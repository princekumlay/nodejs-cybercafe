//first we will require the express and then create the express app
const express = require('express');
const db = require('./db');

//all the routers
const PeopleRouter = require('./routers/peopleRouter');
const CustomerRouter = require('./routers/customerRouter');

//here is the env file which contains all the sensitive information
require('dotenv').config();

//import passport from auth.js
const passport = require('./authentication/auth');
const session = require('express-session');

//************ BODY PARSER IS AN IMPORTANT STEP DO NOT FORGET IT AT ALL */
const bodyParser = require('body-parser');

const app = express();
 
db;

//THIS STEP WILL CONVERT ANY KIND OF INCOMING DATA IN REQUEST BODY IN JS OBJECT FORMAT
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

//necessary process for the passport middleware******
app.use(passport.initialize());
app.use(passport.session());




//------------------------------------------------------------------------------------------------------------
//--------- MIDDLE WARES
//Now we will apply the MIDDLEWARE
//middle ware works between the 'req' and 'res' and handle all the operations in between
//mainly use for logging, authentication, parsing request and more
const logmiddleware = (req, res, next) => {
    console.log(`
        ${new Date().toLocaleString()} 
        Request made to: ${req.url} 
        and method is: ${req.method}
        `);
    next();
};

app.use(logmiddleware);


//-------------- Here we will define the middleware for the authentication of the user
// --------- PASSPORT.JS-----------------------------
//It is used for the authentication in the app
//now we create a variable so that we can use passport for the authentication
// const localAuthMiddleware = passport.authenticate('local', {session: true});
//now we can pass this variable to the endpoint to use the authetication
// app.use(localAuthMiddleware);





//----------------------------------------------------------------------------------------------------
//URL REQUEST OR ENDPOINTS FOR THE APP
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