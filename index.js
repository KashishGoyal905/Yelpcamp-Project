// requiring and acessing express
const express = require('express');
const app = express();
//requiring path for views directory to acess it from anywhere
const path = require('path');
//requiring method-override for pull and patch request download via(npm i method-override)
const methodOverride = require('method-override');
//requiring mongoose
const mongoose = require('mongoose');
//requiring campground.js file here
const Campground = require('./models/campground');
//requiring ejs-mate for templates
const ejsMate = require('ejs-mate');
//requiring class/function Expresserror to throw our custom error 
const ExpressError = require('./Utils/ExpressError');
//requiring function catchasync under utils
const CatchAsync = require('./Utils/CatchAsync');
//requiring joi for vaalidations
const joi = require('joi');
// requiring validatikon schema for campgrounds and reviews
const { campgroundSchema, reviewSchema } = require('./schemas.js');
// requiring revies model for making new reviews
const Review = require('./models/review');
// requiring all campgrounds routes 
const campgrounds = require('./Routes/campgrounds');
// requiring all reviews routes 
const reviews = require('./Routes/reviews');



//connecting mongo man
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//don't know why this is here kinda like connecting with mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// setting up path for our home ejs file and view engine
app.set('view engine', 'ejs');
// by this it will search(home.ejs) via whole path not relative
app.set('views', path.join(__dirname, 'views'));
//parsing body to see output
app.use(express.urlencoded({ extended: true }));
//using method-override
app.use(methodOverride('_method'));
//setting enfine for ejs-mate
app.engine('ejs', ejsMate);






// route which use all campgrounds routes 
// prefix for all campground routes  //it'll use campgrounds file which we require at 25
app.use('/campgrounds', campgrounds);
// route which use all reviews routes 
// prefix for all reviews routes  //it'll use reviews file which we require at 27
app.use('/campgrounds/:id/reviews', reviews);

//first home page
app.get('/', (req, res) => {
    //rendering home.ejs
    res.render('home');
});



//for our custom error it will come here take input message and code than go to next route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

//a route for error handling whenever next(some parameter) is called it will come to this route;
app.use((err, req, res, next) => {
    //default message         //default status
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    // renderinf error.ejs for error and passing message and code
    res.status(statusCode).render('error', { err });
});

//setting port for all the pages
app.listen(3000, () => {
    console.log('serving on port 3000');
});
