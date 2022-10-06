const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const Campground = require('../models/campground');
const ObjectId = require('mongoose').Types.ObjectId;
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
// multer will parse images as a middleware
const upload = multer({ storage });

// router.route lets me group routes together
router.route('/')
    // List all campgrounds
    .get(catchAsync(campgrounds.index))
    // Post route to create new campground
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

// Form for new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    // Show campground
    .get(catchAsync(campgrounds.renderCampground))
    // PUT route that will update
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    // DELETE route for campgrounds
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// Edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;