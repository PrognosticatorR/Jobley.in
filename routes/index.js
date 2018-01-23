var express =require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('superagent');
var querystring = require('querystring');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mailchimpInstance   = 'us17',
    listUniqueId        = 'fcff45cef2',
    mailchimpApiKey     = '5127e5f6662d73921a5bf9727acd7eeb-us17',
    mailchimpClientId   = '859035104606',
    mailchimpSecretKey  = 'ac9064fa299da6180ff1e4b40f6996cf4bd803ce499a551a73';

router.get('/Jobley_aboutus', function(req, res) {
    res.render('aboutus');
});
router.get('/Jobley_faqs', function(req, res) {
    res.render('FAQs');
});
router.get('/Jobley_privacypolicy', function(req, res) {
    res.render('privacy');
});
router.get('/Jobley_terms&conditions', function(req, res) {
    res.render('terms');
});
router.get('/comingsoon', function(req, res) {
    res.render('comingsoon');
});

router.post('/newsletter', function (req,res) {
    if(req.body.email && req.body.name !== "") {
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
            .end(function (err, response) {
                if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                    req.flash('success', 'THANKS TO SUBSCRIBE FOR NEWSLETTER , JOBLEY.IN ');
                    res.redirect('/');
                } else {
                    console.log(err);
                    req.flash('error', 'SomeThing Went Wrong Please Try Again');
                }
            });
        }
        else {
        req.flash('error','PLEASE FILL YOUR NAME & EMAIL FIRST, TO SUBSCRIBE FOR NEWSLETTER.');
        res.redirect('/');
    }
    });

module.exports = router;