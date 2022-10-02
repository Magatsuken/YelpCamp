const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./util/ExpressError');
const e = require('express');
const Joi = require('joi');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews)

// Home Page
app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})