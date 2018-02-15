var express = require('express');
var trimRequest = require('trim-request');
var router = express.Router({ mergeParams: true });
var Category = require('../models/categories');
var SubCategory = require('../models/subcategories');
var middlewere = require('../middlewere');

// ========================Route For Create SubCategories =================================
router.get('/newsub', middlewere.isLoggedIn, function(req, res) {
    Category.findOne({ title: req.params.cat_title }, function(err, category) {
        if (err || !category) {
            console.error(err);
            req.flash('error', 'Unable To Find Category.');
            res.redirect('back');
        } else {
            res.render('newsubs', { category: category });
        }
    });
});

router.post('/', trimRequest.all, middlewere.isLoggedIn, function(req, res) {
    Category.findOne({ title: req.params.cat_title }, function(err, category) {
        if (err || !category) {
            console.error(err);
            req.flash('error', 'Unable To Find Category.');
            res.redirect('back');
        } else {
            SubCategory.create(req.body.subcategory, function(err, subcategory) {
                if (err || !subcategory) {
                    console.error('You Are In truble.');
                    req.flash('error', 'Sub-category Not Found.');
                    res.redirect('back');
                } else {
                    console.log(subcategory);
                    category.subcategories.push(subcategory);
                    category.save();
                    res.redirect('/category/' + req.params.cat_title);
                }
            });
        }
    });
});


router.get('/:subcategory_title', function(req, res) {
    SubCategory.findOne({ title: req.params.subcategory_title }).populate('jobs').exec(function(err, foundsubcategory) {
        if (err || !foundsubcategory) {
            console.error(err);
            req.flash('error', 'Unable To Find Subcategory.');
            res.redirect('back');
        } else {
            Category.findOne({ title: req.params.cat_title }, function(err, category) {
                if (err || !category) {
                    console.error(err);
                    req.flash('error', 'Unable To Find Category.');
                    res.redirect('back');
                } else {
                    res.render('subJobs', {
                        foundsubcategory: foundsubcategory,
                        category: category
                    });
                }
            });
        }
    });
});

module.exports = router;