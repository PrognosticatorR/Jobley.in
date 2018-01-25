var express =require('express');
var router = express.Router();
var Blog = require('../models/blogs');

router.get('/new', function(req, res) {
    res.render('newblog', {
        result: 'result'
    });
});

router.post('/', function(req, res) {
    Blog.create(req.body.blog, function(err, newblog) {
        if (err) {
            console.log(err);
        } else {
            console.log(newblog);
            res.redirect('/blogs/new');
        }
    });
});

router.get('/', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render('blogs', {
                blogs: blogs
            });
        }
    });
});

router.get('/:blog_title', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            Blog.findOne({ title: req.params.blog_title }, function(err, foundBlog) {
                if (err) {
                    console.log(err);
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
router.get('/:blog_title/edit',function (req,res) {
    Blog.findOne({title: req.params.blog_title},function(err,foundBlog) {
        if(err){
            console.log(err);
        }else {
            res.render('editBlog',{
                blog: foundBlog,
            foundBlog:foundBlog});
        }
    })
});

// UPDATE ROUTE

router.put('/:blog_id',function (req,res) {
    Blog.findByIdAndUpdate(req.params.blog_id, req.body.blog, {new: true}, function (err, updatedBlog) {
        if (err) {
            req.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + updatedBlog.title)
        }
    });
});

// Delete Route

router.delete('/:blog_id',function (req,res) {
    Blog.findByIdAndRemove(req.params.blog_id,function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/blogs');
        }
    });
});


module.exports =router;