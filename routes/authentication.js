var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');

router.get('/login', function(req, res) {
    res.render('login');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res) {});

// ====================================================================================================
//                                         LOGOUT
// ====================================================================================================
router.get('/logout', function(req, res) {
    req.logOut();
    req.flash('success', 'Logged You Out , SUCCESSFULLY :) !');
    res.redirect('back');
});


// ======================================================================================================
//                                    Register Functionality
// ========================================================================================================
router.get('/Jobley_signup', function(req, res) {

});

router.post('/Jobley_signup', function(req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.render('signup');
        } else {
            passport.authenticate('local')(req, res, function() {
                req.flash('success', 'Welcome To Jobley.in ' + user.username);
                res.redirect('/');
            });
        }
    });
});

module.exports = router;