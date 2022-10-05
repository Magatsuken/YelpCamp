const Campground = require('../models/campground');
const ObjectId = require('mongoose').Types.ObjectId;

// Show index
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

// Render new form

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

// Create new campground
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// Render edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        const campground = await Campground.findById(id);
        res.render('campgrounds/edit', { campground });
    } else {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
}

// Update campground
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Succesfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// Delete campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!');
    res.redirect(`/campgrounds`);
}

// Render campground
module.exports.renderCampground = async (req, res, next) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        console.log(campground);
        res.render('campgrounds/show', { campground });
    } else {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
}