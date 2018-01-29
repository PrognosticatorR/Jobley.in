var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');


router.get('/Jobley_login', function (req, res) {
    res.render('login');
});
router.post('/Jobley_login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/Jobley_login',
    failureFlash: true
}), function (req, res) {
});

// ====================================================================================================
//                                         LOGOUT
// ====================================================================================================

router.get('/Jobley_logout', function (req, res) {
    req.logOut();
    req.flash('success', 'Logged Out !');
    res.redirect('back');
});


// ======================================================================================================
//                                    Register Functionality
// ========================================================================================================
router.get('/Jobley_signup', function (req, res) {
    res.render('/authentication/signup.ejs');
});

router.post('/Jobley_signup', function (req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.render('authentication/signup');
        } else {
            passport.authenticate('local')(req, res, function () {
                req.flash('success', 'Welcome To Jobley.in ' + user.username);
                console.log(user);
                res.redirect('/');
            });
        }
    });
});


module.exports = router;