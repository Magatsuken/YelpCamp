const express = require('express');
// By default, router will separate req.params, so without including the mergeParams: true,
// This will cause an error when trying to use req.params
const router = express.Router({mergeParams: true});
const catchAsync = require('../util/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

// POST route for reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete route for reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;