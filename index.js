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


// joi validation function for campgrounds so no one can invalidate using postman...
const validateCampground = (req, res, next) => {
    //using schema we made for validation and finding error part in this 
    const { error } = campgroundSchema.validate(req.body);
    //it will show the values we passed in if any error came it will show too
    // console.log(result);
    if (error) {
        //if any error came we throw it using expresserror class
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        //need to call next to move to the next lines of code in route or specifically to catchasync portion
        next();
    }
}

// joi validation function for reviewa so no one can invalidate using postman...
const validateReview = (req, res, next) => {
    //using schema we made for validation and finding error part in this 
    const { error } = reviewSchema.validate(req.body);
    //it will show the values we passed in if any error came it will show too
    // console.log(result);
    if (error) {
        //if any error came we throw it using expresserror class
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        //need to call next to move to the next lines of code in route or specifically to catchasync portion
        next();
    }
}

//first home page
app.get('/', (req, res) => {
    //rendering home.ejs
    res.render('home');
});

//making page for campgrounds
app.get('/campgrounds', CatchAsync(async (req, res, next) => {
    //finding all campgrounds
    const campgrounds = await Campground.find({});
    //rendering index under campgrounds under views && passing all found campgound;
    res.render('campgrounds/index', { campgrounds });
}));

//new page for cretaing new campgrounds
app.get('/campgrounds/new', (req, res) => {
    //rendering to new.ejs file
    res.render('campgrounds/new');
});

//posting new added campground via post req
//function for error handling
app.post('/campgrounds', validateCampground, CatchAsync(async (req, res, next) => {
    //by default it will show us the empty body so we have to parse it
    // res.send(req.body);

    //making new campground by user input
    const campground = new Campground(req.body.campground);
    //saving new campground to database
    await campground.save();
    //redirecting after save 
    res.redirect(`/campgrounds/${campground._id}`);
}));


//whenever someone try to come to this url it will show show.ejs file under campgrounds
app.get('/campgrounds/:id', CatchAsync(async (req, res, next) => {
    //now we will find campground which user asked in url       //parsing objectid 
    const campground = await Campground.findById(req.params.id).populate('reviews');
    //demo for apperror we can do better by app.all()
    // if (!campground) {
    //     //a function/class ExpressError we pass in next();
    //     return next(new ExpressError('Campground not found',404));
    // }
    //rendering show file  under campgrounds under views && we will pass that one found campground in show file
    res.render('campgrounds/show', { campground });
}));

//edit page for campgrounds 
app.get('/campgrounds/:id/edit', CatchAsync(async (req, res, next) => {
    //now we will find campground which user asked in url 
    const campground = await Campground.findById(req.params.id);
    //rendering to edit page to edit a campground
    res.render('campgrounds/edit', { campground });

}));

//put request for updating specific campground
app.put('/campgrounds/:id', validateCampground, CatchAsync(async (req, res, next) => {
    //to check it worked
    // res.send("it worked");

    // finding id via url
    const { id } = req.params;
    // finding by id and updating && spreading in object 
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // redirecting to specific campground details page
    res.redirect(`/campgrounds/${campground._id}`);
}));

//deleting specific campground as simple as that
app.delete('/campgrounds/:id', CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

//route for making reviews post req
app.post('/campgrounds/:id/reviews', validateReview, CatchAsync(async (req, res, next) => {
    // finding that specific campground in which we makin a review
    const campground = await Campground.findById(req.params.id);
    // making new review using schema
    const review = new Review(req.body.review);
    // pushing to campground
    campground.reviews.push(review);
    // saving review
    await review.save();
    // saving review to campground
    await campground.save();
    // redirecting to specific campground
    res.redirect(`/campgrounds/${campground._id}`);
}));

//review deleting route
app.delete('/campgrounds/:id/reviews/:reviewId', CatchAsync(async(req, res) => {
    // finding campground and review _id
    const { id, reviewId } = req.params;
    // updating campground review array of basicaly removing that specific single revie from array
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // removing from review
    await Review.findByIdAndDelete(reviewId);
    // redirecting
    res.redirect(`/campgrounds/${id}`);
}));

// just to make sure our database is connected👇
// it will take to the campground page /makecampground
// app.get('/makecampground', async (req, res) => {
//     // have to make it async and await coz it's take time so we make it async so it will stop until then
//     const camp = new Campground({ title: 'My Backyard',description: 'free camping'});
//     await camp.save();
//     res.send(camp);
// });
// don't need this now☝️

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
