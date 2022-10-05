const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../util/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

// Render register form
router.get('/register', users.renderRegisterForm);

// Create new user
router.post('/register', catchAsync(users.createUser));

// Render login form
router.get('/login', users.renderLoginForm);

// Passport middleware to authenticate a login
// Keep session info set to true is needed to get the redirect to work properly
// User login
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)


// User logout
router.get('/logout', users.logout);

module.exports = router;