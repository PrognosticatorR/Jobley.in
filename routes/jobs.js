var express =require('express');
var bodyParser = require('body-parser');
var router = express.Router({mergeParams: true});
var Category = require('../models/categories');
var SubCategory = require('../models/subcategories');
var Job = require('../models/jobs');
var User = require('../models/users');
var middlewere = require('../middlewere');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// ==================  Showing Jobs On A category Route ========================
router.get("/", function(req, res) {
    Category.findById(req.params.id).populate("jobs").exec(function(err, category) {
        if (err) {
            console.log(err);
        } else if (category.subcategories.length > 0) {
            Category.findById(req.params.id).populate("subcategories").exec(function(err, category) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("allsubs", {
                        category: category
                    });
                }
            });
        } else {
            console.log(category);
            res.render("jobs", {
                category: category
            });
        }
    });
});

// =================== Route For Creating A new Job =============================
router.get("/job/new",middlewere.isLoggedIn, function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
        } else {
            res.render("new", {
                category: category
            });
        }
    });
});

// ====================================== POsting  JObs ==========================
router.post('/job',middlewere.isLoggedIn,function(req, res) {
    Category.findOne({ title: req.body.job.Category }, function(err, category) {
        console.log(category);
        if (err) {
            console.log(err);
            res.send('You Got An Error :(');
            // else if(category.subcategory)
        } else {
            console.log(req.body);
            Job.create(req.body.job, function(err, job) {
                if (err) {
                    console.log(err);
                } else if (job.subcategory) {
                    SubCategory.findOne({ title: req.body.job.subcategory }, function(err, foundsubcategory) {
                        console.log(foundsubcategory);
                        foundsubcategory.jobs.push(job);
                        foundsubcategory.save();
                        res.send('You Saved A Job In Subcategory. :)');
                    });
                } else {
                    category.jobs.push(job);
                    category.save();
                    res.redirect('/category/' + category._id);
                }
            });
        }
    });
});

// ============================ Showing A Jobs On ============================
router.get('/job/:job_id', function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
        } else {
            Job.findById(req.params.job_id, function(err, foundJob) {
                if (err) {
                    console.log(err);
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

router.get('/job/:job_id/edit',middlewere.isLoggedIn, function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            req.flash('error','Something Went Wrong.');
            console.log(err);
        } else {
            Job.findById(req.params.job_id, function(err, foundJob) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(foundJob);
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

router.put('/job/:job_id',middlewere.isLoggedIn, function(req, res) {
    Job.findByIdAndUpdate(req.params.job_id, req.body.job, { new: true }, function(err, updatedJob) {
        if (err) {
            res.redirect('/category/:id');
        } else {
            console.log(updatedJob);
            res.redirect('/category/' + req.params.id + '/job/' + req.params.job_id);
        }
    });
});
//

// ===================================================================================================
//                                   Route For Delete A Job
// ===================================================================================================
router.delete('/category/:id/job/:job_id',middlewere.isLoggedIn, function(req, res) {
    Job.findByIdAndRemove(req.params.job_id, function(err) {
        if (err) {
            console.log(err);
            res.send('You Hve An Error :(');
        } else {
            res.redirect('/category/' + req.params.id);
        }
    });
});

module.exports =router;