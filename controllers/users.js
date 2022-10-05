const User = require('../models/user');

// Render register form
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

// Create new user
module.exports.createUser = async (req, res, next) => {
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
}

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

// User login
module.exports.login = (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
}

// User logout
module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Successfully logged out');
        res.redirect('/campgrounds');
    })
}