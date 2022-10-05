const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const Campground = require('../models/campground');
const ObjectId = require('mongoose').Types.ObjectId;
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

// List all campgrounds
router.get('/', catchAsync(campgrounds.index));

// Form for new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Post route to create new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// PUT route that will update
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// DELETE route for campgrounds
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Show campground
router.get('/:id', catchAsync(campgrounds.renderCampground))

module.exports = router;