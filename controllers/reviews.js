const Campground = require('../models/campground');
const Review = require('../models/review');

// review post req functions
module.exports.createReview = async (req, res, next) => {
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
    // review added message
    req.flash('success', 'Created Review successfully');
    // redirecting to specific campground
    res.redirect(`/campgrounds/${campground._id}`);
};

// review delete route
module.exports.deleteReview = async (req, res) => {
    // finding campground and review _id
    const { id, reviewId } = req.params;
    // updating campground review array of basicaly removing that specific single revie from array
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // removing from review
    await Review.findByIdAndDelete(reviewId);
    // deleting review message
    req.flash('success', 'Deleted Review successfully');
    // redirecting
    res.redirect(`/campgrounds/${id}`);
};