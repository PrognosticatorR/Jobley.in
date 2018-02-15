var Category = require('../models/categories');
var Job = require('../models/jobs');

var middlewereObject = {};

middlewereObject.checkOwnerShip = function(req, res, next) {
    if (req.isAuthenticated()) {
        Category.findById(req.params.id, function(err, category) {
            if (err) {
                console.log(err);
            } else {
                Job.findById(req.params.job_id, function(err, foundJob) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (foundJob.auther.id.equals(req.user._id)) {
                            next();
                        } else {
                            res.redirect('back');
                        }
                    }
                });
            }
        });
    }
};

middlewereObject.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'Please Log In First.');
        res.redirect('/login');
    }
};

module.exports = middlewereObject;