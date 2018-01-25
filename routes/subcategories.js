var express =require('express');
var router = express.Router({mergeParams: true});
var Category = require('../models/categories');
var SubCategory = require('../models/subcategories');


// ========================Route For Create SubCategories =================================
router.get('/newsub', function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
        } else {
            res.render('newsubs', { category: category });
        }
    });
});

router.post('/', function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
        } else {
            console.log(category);
        }
        SubCategory.create(req.body.subcategory, function(err, subcategory) {
            if (err) {
                console.log('You Are In truble.');
            } else {
                console.log(subcategory);
                category.subcategories.push(subcategory);
                category.save();
                res.redirect('/category/' + category._id);
            }
        });
    });
});


router.get('/:subcategory_title', function(req, res) {
    SubCategory.findOne({ title: req.params.subcategory_title }).populate('jobs').exec(function(err, foundsubcategory) {
        if (err) {
            console.log(err);
        } else {
            Category.findById(req.params.id, function(err, category) {
                if (err) {
                    console.log(err);
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

module.exports =router;
