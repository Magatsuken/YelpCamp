const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home Page
app.get('/', (req, res) => {
    res.render('home');
})

// List all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// Form for new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// Post route to create new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

// Edit form
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
})

// PUT route that will update
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

// DELETE route
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds/`);
})

// Show campground
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})