//passport is an authentication middleware for nodejs application
//it easily works with expressjs and other frameworks and allows local and other authentication
//it simplifies the process of handling user authentication
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const People = require('../models/peopleSchema');
const Customer = require('../models/customerSchema');
const bcrypt = require('bcrypt');


//it is used like that and localStrategy function takes three attributes one like username
//password and done which works as a callback function which takes three value called "error", "user" and "info"
//**************let make this strategy work for more than one collection */
passport.use(new localStrategy(async(username, pass, done) => {
    try {

        console.log('query made for :' + username);// it is just to check the username




        //array of collection 
        const collections = [People, Customer];

        let user = null;
        let collectionName = '';

        //this loop will find the user in each of the collection and stores the collection name
        for(let collection of collections){
            user = await collection.findOne({username});

            if(user){
                collectionName = collection.modelName;//it will get the collection name
                // console.log('collection name: ' + collectionName);
                break;
            }
        }




        //finding the user in the database based on the name provided and stored in the user variable
        // const user = await People.findOne({username: username});
        // console.log('passed the await function');
        // console.log({user: user},{collectionName});

        if(!user)//when user not found then this conditional statement will work
            return done(null, false,{message: 'Incorrect username'});
        // console.log('user found');




        //if user found then check the password matched or not
        // const isPasswordMatch = pass === user.password ? true : false;
        // const isPasswordMatch = await user.comparepassword(pass);
        const isPasswordMatch = await bcrypt.compare(pass, user.password);

        if(isPasswordMatch){
            console.log('password matched 12')
            return done(null, user);
        }
        else{
            console.log('password does not match')
            return done (null, false, {message: 'Incorrect password'});
        }



        
    } catch (error) {
        console.log('provide a username and password for authentication');
        return done(error);
    };



}));



//it stores the user ID 
passport.serializeUser ((user, done) => {
    done(null, user.id);
});


//it finds the user with the help of user ID
passport.deserializeUser(async(id, done) => {
    try {
        //array of collection 
    const collections = [People, Customer];

    let user = null;
    let collectionName = '';

    //this loop will find the user in each of the collection and stores the collection name
    for(let collection of collections){
        user = await collection.findById(id);

        if(user){
            collectionName = collection.modelName;//it will get the collection name
            console.log('collection name: ' + collectionName);
            break;
        }
    }
    done(null, user);

    } catch (error) {
        done(error);
    }
})

module.exports = passport;
