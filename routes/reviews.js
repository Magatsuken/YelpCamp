const express = require('express');
// By default, router will separate req.params, so without including the mergeParams: true,
// This will cause an error when trying to use req.params
const router = express.Router({mergeParams: true});
const catchAsync = require('../util/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

// POST route for reviews
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Delete route for reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    // $pull is a function with mongoose, read docs :)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;