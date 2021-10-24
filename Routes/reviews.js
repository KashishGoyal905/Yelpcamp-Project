// all reviews routes file

// requiring express
const express = require('express');
// using router function
const router = express.Router({mergeParams:true}); //for req.params to work
//requiring campground.js file here
const Campground = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// review models here
const Review = require('../models/review');
//requiring class/function Expresserror to throw our custom error 
const ExpressError = require('../Utils/ExpressError');
//requiring function catchasync under utils
const CatchAsync = require('../Utils/CatchAsync');
// requiring validatikon schema for campgrounds and reviews
const { reviewSchema } = require('../schemas.js');
// requiring controller fuction review file
const reviews = require('../controllers/reviews');


// joi validation function for reviewa so no one can invalidate using postman...
// const validateReview = (req, res, next) => {
//     //using schema we made for validation and finding error part in this 
//     const { error } = reviewSchema.validate(req.body);
//     //it will show the values we passed in if any error came it will show too
//     // console.log(result);
//     if (error) {
//         //if any error came we throw it using expresserror class
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400);
//     }
//     else {
//         //need to call next to move to the next lines of code in route or specifically to catchasync portion
//         next();
//     }
// };

//route for making reviews post req
router.post('/',isLoggedIn, validateReview, CatchAsync(reviews.createReview));

//review deleting route 
router.delete('/:reviewId', CatchAsync(reviews.deleteReview));


// exporting all routers
module.exports = router;
