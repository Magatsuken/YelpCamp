const express = require('express');
const router = express.Router();
const catchAsync = require('../util/catchAsync');
const ExpressError = require('../util/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const ObjectId = require('mongoose').Types.ObjectId;

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        return next();
    }
}

// List all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// Form for new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

// Post route to create new campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Edit form
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        const campground = await Campground.findById(id);
        res.render('campgrounds/edit', { campground });
    } else {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
}))

// PUT route that will update
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Succesfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE route for campgrounds
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!');
    res.redirect(`/campgrounds`);
}))

// Show campground
router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        const campground = await Campground.findById(id).populate('reviews');
        res.render('campgrounds/show', { campground });
    } else {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
}))

module.exports = router;