var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('superagent');
var path = require('path');
var multer = require('multer');
var dotenv = require('dotenv').config();
var querystring = require('querystring');
var middlewere = require('../middlewere');
var config = require('../config/config');

var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, 'Jobley ' + '-' + Date.now() + path.extname(file.originalname));
    }
});
var uplaod = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myFile');

function checkFileType(file, cb) {
    var filetypes = /jpeg|jpg|png|gif|pdf/;
    var extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    var mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Please Upload Images And PDF Only');
    }
}

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/aboutus', function(req, res) {
    res.render('aboutus');
});
router.get('/faqs', function(req, res) {
    res.render('FAQs');
});
router.get('/privacypolicy', function(req, res) {
    res.render('privacy');
});
router.get('/terms&conditions', function(req, res) {
    res.render('terms');
});
router.get('/comingsoon', function(req, res) {
    res.render('comingsoon');
});

router.get('/uploadFile', middlewere.isLoggedIn, function(req, res) {
    res.render('uploads', { result: 'result' });
});

router.get('/contact-us', function(req, res) {
    res.render('contactus');
});
router.get('/askUs', function(req, res) {
    res.render('askus');
});

router.post('/uploadFile', middlewere.isLoggedIn, function(req, res) {
    uplaod(req, res, function(err) {
        if (err) {
            res.render('uploads', {
                msg: err,
                file: req.file
            });
        } else {
            if (req.file === undefined) {
                res.render('uploads', {
                    msg: "Error : No File Selected ."
                });
            } else {
                console.log(req.file);
                res.render('uploads', {
                    msg: "File Uploaded Successfully."
                });
            }
        }
    });
});

router.get('/files', middlewere.isLoggedIn, function(req, res) {
    var files = fs.readdirSync('public/uploads');
    var blogImage = [];
    files.forEach(function(item) {
        if (item.split('.').pop() === 'png' ||
            item.split('.').pop() === 'jpg' ||
            item.split('.').pop() === 'jpeg' ||
            item.split('.').pop() === 'svg' ||
            item.split('.').pop() === 'pdf') {
            var ABC = {
                image: '/uploads/' + item,
                folder: '/'
            };
            blogImage.push(ABC);
        }
    });
    res.send(blogImage);
});

router.post('/delete_file', middlewere.isLoggedIn, function(req, res) {
    var url_del = 'public' + req.body.url_del;
    console.log(url_del);
    if (fs.existsSync(url_del)) {
        fs.unlinkSync(url_del);
    }
    res.redirect('back');
});


var mailchimpInstance = config.mailchimpInstance,
    listUniqueId = config.listUniqueId,
    mailchimpApiKey = config.mailchimpApiKey,
    mailchimpClientId = config.mailchimpClientId,
    mailchimpSecretKey = config.mailchimpSecretKey;


router.post('/newsletter', function(req, res) {
    if (req.body.email && req.body.name !== "") {
        request
            .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
            .set('Content-Type', 'application/json;charset=utf-8')
            .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64'))
            .send({
                'email_address': req.body.email,
                'merge_fields': {
                    'FNAME': req.body.name
                },
                'status': 'subscribed'
            })
            .end(function(err, response) {
                if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                    req.flash('success', 'THANKS TO SUBSCRIBE FOR NEWSLETTER , JOBLEY.IN ');
                    res.redirect('/');
                } else {
                    console.log(err);
                    req.flash('error', 'SomeThing Went Wrong Please Try Again');
                }
            });
    } else {
        req.flash('error', 'PLEASE FILL YOUR NAME & EMAIL FIRST, TO SUBSCRIBE FOR NEWSLETTER.');
        res.redirect('/');
    }
});

module.exports = router;