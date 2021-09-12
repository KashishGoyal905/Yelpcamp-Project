// all reviews routes file

// requiring express
const express = require('express');
// using router function
const router = express.Router({mergeParams:true}); //for req.params to work
//requiring campground.js file here
const Campground = require('../models/campground');
//requiring class/function Expresserror to throw our custom error 
const ExpressError = require('../Utils/ExpressError');
//requiring function catchasync under utils
const CatchAsync = require('../Utils/CatchAsync');
// requiring validatikon schema for campgrounds and reviews
const { reviewSchema } = require('../schemas.js');


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
};

//route for making reviews post req
router.post('/', validateReview, CatchAsync(async (req, res, next) => {
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
router.delete('/:reviewId', CatchAsync(async (req, res) => {
    // finding campground and review _id
    const { id, reviewId } = req.params;
    // updating campground review array of basicaly removing that specific single revie from array
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // removing from review
    await Review.findByIdAndDelete(reviewId);
    // redirecting
    res.redirect(`/campgrounds/${id}`);
}));


// exporting all routers
module.exports = router;
