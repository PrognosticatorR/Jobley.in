var express = require('express');
var trimRequest = require('trim-request');
var router = express.Router();
var Blog = require('../models/blogs');
var middlewere = require('../middlewere');

router.get('/new', middlewere.isLoggedIn, function(req, res) {
    res.render('newblog', {
        result: 'result'
    });
});

router.post('/', middlewere.isLoggedIn, function(req, res) {
    Blog.create(req.body.blog, function(err, newblog) {
        if (err) {
            console.error('New Blog Not Created.');
            console.log(err);
        } else {
            res.redirect('/blogs/new');
        }
    });
});

router.get('/', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err || !blogs) {
            console.error(err);
            req.flash('error', 'Somethng Went Wrong,Blog Not Found.');
            res.redirect('/blogs');
        } else {
            res.render('blogs', {
                blogs: blogs
            });
        }
    });
});

router.get('/:blog_title', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err || !blogs) {
            console.error(err);
            req.flash('error', 'Somethng Went Wrong,Blog Not Found.');
            res.redirect('/blogs');
        } else {
            Blog.findOne({ title: req.params.blog_title }, function(err, foundBlog) {
                if (err || !foundBlog) {
                    console.error(err);
                    req.flash('error', 'Somethng Went Wrong,Blog Not Found.');
                    res.redirect('/blogs');
                } else {
                    res.render('showblog', {
                        foundBlog: foundBlog,
                        blogs: blogs
                    });
                }
            });
        }
    });
});

// EDIT ROUTE
router.get('/:blog_title/edit', middlewere.isLoggedIn, function(req, res) {
    Blog.findOne({ title: req.params.blog_title }, function(err, foundBlog) {
        if (err || !foundBlog) {
            res.error(err);
            req.flash('error', 'Somethng Went Wrong,Blog Not Found.');
            res.redirect('/blogs');
        } else {
            res.render('editBlog', {
                blog: foundBlog,
                foundBlog: foundBlog
            });
        }
    });
});

// UPDATE ROUTE

router.put('/:blog_id', middlewere.isLoggedIn, function(req, res) {
    Blog.findByIdAndUpdate(req.params.blog_id, req.body.blog, { new: true }, function(err, updatedBlog) {
        if (err || !updatedBlog) {
            req.flash('error', 'Somethng Went Wrong,Blog Not Found.');
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + updatedBlog.title);
        }
    });
});

// Delete Route

router.delete('/:blog_id', middlewere.isLoggedIn, function(req, res) {
    Blog.findByIdAndRemove(req.params.blog_id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    });
});


module.exports = router;