// all campgroundes routes file

// requiring express
const express = require('express');
// using router function
const router = express.Router();
//requiring campground.js file here
const Campground = require('../models/campground');
//requiring class/function Expresserror to throw our custom error 
const ExpressError = require('../Utils/ExpressError');
//requiring function catchasync under utils
const CatchAsync = require('../Utils/CatchAsync');
// requiring validatikon schema for campgrounds and reviews
const { campgroundSchema } = require('../schemas.js');
// requiring middleware file for keep signed in users
const { isLoggedIn } = require('../middleware');    


// file for different types of similar routes 
// all campground routes
// instead of `app.` we have to use `router.`

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


//making page for campgrounds
router.get('/', CatchAsync(async (req, res, next) => {
    //finding all campgrounds
    const campgrounds = await Campground.find({});
    //rendering index under campgrounds under views && passing all found campgound;
    res.render('campgrounds/index', { campgrounds });
}));

//new page for cretaing new campgrounds
router.get('/new', isLoggedIn,(req, res) => {
    // putting condtion to be logged in to submit any new campground
    // if (!isAuthenticated()) {
    //     // flash error
    //     req.flash('error', 'you must be signed in');
    //     // rediercting
    //     return res.redirect('/login');
    // }
    //rendering to new.ejs file
    res.render('campgrounds/new');
});

//posting new added campground via post req
//function for error handling
router.post('/', isLoggedIn, validateCampground, CatchAsync(async (req, res, next) => {
    //by default it will show us the empty body so we have to parse it
    // res.send(req.body);

    //making new campground by user input
    const campground = new Campground(req.body.campground);
    //saving new campground to database
    await campground.save();
    // flashing a message 
    req.flash('success', 'Suceesfully Created A Campground');
    //redirecting after save 
    res.redirect(`/campgrounds/${campground._id}`);
}));


//whenever someone try to come to this url it will show show.ejs file under campgrounds
router.get('/:id', CatchAsync(async (req, res, next) => {
    //now we will find campground which user asked in url       //parsing objectid 
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // error flash message
    if (!campground) {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
    //rendering show file  under campgrounds under views && we will pass that one found campground in show file
    res.render('campgrounds/show', { campground });
}));

//edit page for campgrounds 
router.get('/:id/edit', CatchAsync(async (req, res, next) => {
    //now we will find campground which user asked in url 
    const campground = await Campground.findById(req.params.id);
    // error flash message
    if (!campground) {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
    //rendering to edit page to edit a campground
    res.render('campgrounds/edit', { campground });

}));

//put request for updating specific campground
router.put('/:id', isLoggedIn, validateCampground, CatchAsync(async (req, res, next) => {
    //to check it worked
    // res.send("it worked");

    // finding id via url
    const { id } = req.params;
    // finding by id and updating && spreading in object 
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // updated flash message
    req.flash('success', "Campground Updated Sucessfully");
    // redirecting to specific campground details page
    res.redirect(`/campgrounds/${campground._id}`);
}));

//deleting specific campground as simple as that
router.delete('/:id', isLoggedIn, CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    // deleting review message
    req.flash('success', 'Deleted Review successfully');
    res.redirect('/campgrounds');
}));


// exporting all routers
module.exports = router;