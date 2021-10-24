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
const { isLoggedIn,isAuthor, validateCampground  } = require('../middleware');    
// requiring campground controllers which have bunch of methods
const campgrounds = require('../controllers/campgrounds');
// file for different types of similar routes 
// all campground routes
// instead of `app.` we have to use `router.`



//making page for campgrounds
router.get('/', CatchAsync(campgrounds.index));

//new page for cretaing new campgrounds
router.get('/new', isLoggedIn,campgrounds.renderNewForm);

//posting new added campground via post req
//function for error handling
router.post('/', isLoggedIn, validateCampground, CatchAsync(campgrounds.createCampgrounds));


//whenever someone try to come to this url it will show show.ejs file under campgrounds
router.get('/:id', CatchAsync(campgrounds.showCampground));

//edit page for campgrounds 
router.get('/:id/edit',isAuthor, CatchAsync(campgrounds.renderEditForm));

//put request for updating specific campground
router.put('/:id', isLoggedIn, isAuthor,validateCampground, CatchAsync(campgrounds.updateCampground));

//deleting specific campground as simple as that
router.delete('/:id', isLoggedIn,isAuthor, CatchAsync(campgrounds.delete));


// exporting all routers
module.exports = router;