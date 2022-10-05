const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../util/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

// Passport middleware to authenticate a login
// Keep session info set to true is needed to get the redirect to work properly
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
})

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Successfully logged out');
        res.redirect('/campgrounds');
    })
})

module.exports = router;