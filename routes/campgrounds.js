const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const Campground = require('../models/campground');
const ObjectId = require('mongoose').Types.ObjectId;
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

// router.route lets me group routes together
router.route('/')
    // List all campgrounds
    .get(catchAsync(campgrounds.index))
    // Post route to create new campground
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

    // Form for new campground
    router.get('/new', isLoggedIn, campgrounds.renderNewForm);
    
router.route('/:id')
    // Show campground
    .get(catchAsync(campgrounds.renderCampground))
    // PUT route that will update
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    // DELETE route for campgrounds
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// Edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;