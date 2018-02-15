var express = require('express');
var router = express.Router();
var trimRequest = require('trim-request');
var ShortCat = require('../models/shortCat');
var middlewere = require('../middlewere');
var Admit = require('../models/admitcard')


router.get('/cat/new', middlewere.isLoggedIn, function(req, res) {
    res.render('newShortcat');
})
router.post("/cat", trimRequest.all, middlewere.isLoggedIn, function(req, res) {
    ShortCat.create(req.body.shortcat, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash('success', 'Category created successfully :) !');
            res.redirect("back");
        }
    });
});


router.get('/cat/:short_title', function(req, res) {
    ShortCat.findOne({ title: req.params.short_title }).populate("admits").exec(function(err, foundCat) {
        if (err || !foundCat) {
            req.flash('error', 'Cat Not Found' + 404 + 'Error.');
            res.redirect('back');
        } else {
            res.render('admitcard', {
                foundCat: foundCat
            });
        }
    });
});

router.get('/cat/:short_title/new', middlewere.isLoggedIn, function(req, res) {
    ShortCat.findOne({ title: req.params.short_title }, function(err, foundCat) {
        if (err || !foundCat) {
            req.flash('error', 'Short Category Not Found.');
            res.redirect('back');
        } else {
            res.render('newadmit', {
                foundCat: foundCat
            });
        }
    })

});

router.post("/cat/:short_title", trimRequest.all, middlewere.isLoggedIn, function(req, res) {
    ShortCat.findOne({ title: req.body.admitcard.category }, function(err, foundCat) {
        if (err || !foundCat) {
            req.flash('error', 'Blogs Not Found' + 404 + 'Error.');
            res.redirect('back');
        } else {
            Admit.create(req.body.admitcard, function(err, admit) {
                if (err) {
                    console.error(err);
                } else {
                    foundCat.admits.push(admit);
                    foundCat.save();
                    req.flash('success', 'Successfully Added  To Category !');
                    res.redirect('/cat/' + req.params.short_title);
                }
            })
        }
    });
});
module.exports = router;