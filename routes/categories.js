var express =require('express');
var router = express.Router();
var Category = require('../models/categories');


router.get('/', function(req, res) {
    Category.find({}).populate('jobs').exec(function(err, categories) {
        if (err) {
            console.log(err);
        } else {
            res.render("home", {
                categories: categories
            });
        }
    });
});

//========================= Posting data on home ============================
router.post("/", function(req, res) {
    Category.create(req.body.category, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/");
        }
    });
});

router.get('/newcategory', function(req, res) {
    res.render('newcategory');
});

module.exports =router;