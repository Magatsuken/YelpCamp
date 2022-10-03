const express = require('express');
// By default, router will separate req.params, so without including the mergeParams: true,
// This will cause an error when trying to use req.params
const router = express.Router({mergeParams: true});
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const { reviewSchema} = require('../schemas.js');
const Review = require('../models/review');
const Campground = require('../models/campground');



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        return next();
    }
}

// POST route for reviews
router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Delete route for reviews
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    // $pull is a function with mongoose, read docs :)
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;