var express = require('express');
var bodyParser = require('body-parser');
var trimRequest = require('trim-request');

var router = express.Router({ mergeParams: true });
var Category = require('../models/categories');
var SubCategory = require('../models/subcategories');
var Job = require('../models/jobs');
var User = require('../models/users');
var middlewere = require('../middlewere');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// ==================  Showing Jobs On A category Route ========================
router.get("/", function(req, res) {
    Category.findOne({ title: req.params.cat_title }).populate("jobs").exec(function(err, category) {
        if (err || !category) {
            req.flash('error', 'Category Not Found. ERROR Code ' + 404);
            res.redirect('back');
        } else if (category.subcategories.length > 0) {
            Category.findOne({ title: req.params.cat_title }).populate("subcategories").exec(function(err, category) {
                if (err || !category) {
                    console.error(err);
                    req.flash('error', ' Not Found. ERROR code ' + 404);
                    res.redirect('back');
                } else {
                    res.render("allsubs", {
                        category: category
                    });
                }
            });
        } else {
            res.render("jobs", {
                category: category
            });
        }
    });
});

// =================== Route For Creating A new Job =============================
router.get("/job/new", middlewere.isLoggedIn, function(req, res) {
    Category.findOne({ title: req.params.cat_title }, function(err, category) {
        if (err || !category) {
            console.error(err);
            req.flash('error', 'Category Not Found. ERROR Code ' + 404);
            res.redirect('back');
        } else {
            res.render("new", {
                category: category
            });
        }
    });
});

// ====================================== POsting  JObs ==========================
router.post('/job', trimRequest.all, middlewere.isLoggedIn, function(req, res) {
    Category.findOne({ title: req.body.job.Category }, function(err, category) {
        if (err || !category) {
            console.error(err);
            req.flash('error', 'Category Not Found. ERROR Code ' + 404);
            res.redirect('back');
        } else {
            Job.create(req.body.job, function(err, job) {
                if (err) {
                    console.log(err);
                } else if (job.subcategory) {
                    SubCategory.findOne({ title: req.body.job.subcategory }, function(err, foundsubcategory) {
                        if (err || !foundsubcategory) {
                            console.error(err);
                            req.flash('error', 'subcategory not found.');
                            res.redirect('back');
                        } else {
                            foundsubcategory.jobs.push(job);
                            foundsubcategory.save();
                            req.flash('success', 'Successfully Added A Job To Sub Category !');
                            res.redirect('back');
                        }
                    });
                } else {
                    category.jobs.push(job);
                    category.save();
                    req.flash('success', 'Successfully Added A Job To Category !');
                    res.redirect('/category/' + req.params.cat_title);
                }
            });
        }
    });
});

// ============================ Showing A Jobs On ============================
router.get('/job/:job_title', function(req, res) {
    Category.findOne({ title: req.params.cat_title }, function(err, category) {
        if (err || !category) {
            console.log(err);
            req.flash('error', 'category not found , refused connection with error code ' + 404);
            res.redirect('back');
        } else {
            Job.findOne({ title: req.params.job_title }, function(err, foundJob) {
                if (err || !foundJob) {
                    console.error(err);
                    req.flash('error', 'Job not found , refused connection with error code ' + 404);
                    res.redirect('back');
                } else {
                    res.render('show', {
                        foundJob: foundJob,
                        category: category
                    });
                }
            });
        }
    });
});

// =============================================================================================
//                                     Edit Route
// =============================================================================================

router.get('/job/:job_title/edit', middlewere.isLoggedIn, function(req, res) {
    Category.findOne({ title: req.params.cat_title }, function(err, category) {
        if (err || !category) {
            console.error(err);
            req.flash('error', 'Something Went Wrong.');
            res.redirect('back');
        } else {
            Job.findOne({ title: req.params.job_title }, function(err, foundJob) {
                if (err || !foundJob) {
                    console.error(err);
                    req.flash('error', 'Something Went Wrong.');
                    res.redirect('back');
                } else {
                    res.render('edit', {
                        foundJob: foundJob,
                        category: category
                    });
                }
            });
        }
    });
});

// =============================================================================================
//                                         Update Job Route
// =============================================================================================

router.put('/job/:job_title', middlewere.isLoggedIn, function(req, res) {
    Job.findOneAndUpdate({ title: req.params.job_title }, req.body.job, { new: true }, function(err, updatedJob) {
        if (err || !updatedJob) {
            console.error(err);
            req.flash('error', " Can't Update A Job. ");
            res.redirect('/category/' + req.params.cat_title);
        } else {
            res.redirect('/category/' + req.params.cat_title + '/job/' + req.params.job_title);
        }
    });
});

// ===================================================================================================
//                                   Route For Delete A Job
// ===================================================================================================
router.delete('/job/:job_title', middlewere.isLoggedIn, function(req, res) {
    Job.findOneAndRemove({ title: req.params.job_title }, function(err) {
        if (err) {
            console.log(err);
            res.send('You Hve An Error :(');
        } else {
            res.redirect('/category/' + req.params.cat_title);
        }
    });
});
module.exports = router;