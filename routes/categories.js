var express = require('express');
var router = express.Router();
var Category = require('../models/categories');
var Blog = require('../models/blogs');
var middlewere = require('../middlewere');


router.get('/', function(req, res) {
    Category.find({}).populate('jobs').exec(function(err, categories) {
        if (err || !categories) {
            console.error(err);
            req.flash('error', 'categories not Found.');
            res.redirect('back');
        } else {
            Blog.find({}, function(err, blogs) {
                if (err || !blogs) {
                    console.error(err);
                    req.flash('error', 'Blogs Not Found' + 404 + 'Error.');
                    res.redirect('back');
                } else {
                    res.render("home", {
                        categories: categories,
                        blogs: blogs
                    });
                }
            })
        }
    });
});

//========================= Posting data on home ============================
router.post("/", middlewere.isLoggedIn, function(req, res) {
    Category.create(req.body.category, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash('success','Category created successfully :) !');
            res.redirect("/");
        }
    });
});

router.get('/newcategory',middlewere.isLoggedIn, function(req, res) {
    res.render('newcategory');
});

module.exports = router;