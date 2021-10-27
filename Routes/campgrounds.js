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
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
// requiring campground controllers which have bunch of methods
const campgrounds = require('../controllers/campgrounds');
// file for different types of similar routes 
// all campground routes
// instead of `app.` we have to use `router.`


// combining two routes
router.route('/')
    //making page for campgrounds
    .get(CatchAsync(campgrounds.index))
    //posting new added campground via post req
    //function for error handling
    .post(isLoggedIn, validateCampground, CatchAsync(campgrounds.createCampgrounds));


//new page for cretaing new campgrounds
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    //whenever someone try to come to this url it will show show.ejs file under campgrounds
    .get(CatchAsync(campgrounds.showCampground))
    //put request for updating specific campground
    .put(isLoggedIn, isAuthor, validateCampground, CatchAsync(campgrounds.updateCampground))
    //deleting specific campground as simple as that
    .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.delete));

//edit page for campgrounds 
router.get('/:id/edit', isAuthor, CatchAsync(campgrounds.renderEditForm));



// exporting all routers
module.exports = router;