const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../util/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    // Render register form
    .get(users.renderRegisterForm)
    // Create new user
    .post(catchAsync(users.createUser))

router.route('/login')
    // Render login form
    .get(users.renderLoginForm)
    // Passport middleware to authenticate a login
    // Keep session info set to true is needed to get the redirect to work properly
    // User login
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)


// User logout
router.get('/logout', users.logout);

module.exports = router;