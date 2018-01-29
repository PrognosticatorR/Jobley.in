var bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require('mongoose'),
    express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    flash = require('connect-flash'),
    Guid = require('guid'),
    Mustache = require('mustache'),
    Request = require('request'),
    Querystring = require('querystring');

var Category = require('./models/categories'),
    Job = require('./models/jobs'),
    SubCategory = require('./models/subcategories'),
    Blog = require('./models/blogs'),
    User = require('./models/users');

var categoryRoutes = require('./routes/categories');
var subCategoryRoutes = require('./routes/subcategories');
var blogRoutes = require('./routes/blogs');
var authenticationRoutes = require('./routes/authentication');
var jobRoutes = require('./routes/jobs');
var indexRoutes = require('./routes/index');

// DATABASEURL= mongodb://localhost/Jobley
mongoose.connect('mongodb://localhost/AnswerMachin', { useMongoClient: true });
mongoose.Promise = global.Promise;

var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, 'Jobley ' + '-' + Date.now().toDateString() + path.extname(file.originalname));
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
app.set('view engine', 'ejs');

app.use(require('express-session')({
    secret: 'Jobley Is Going To Rock.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(categoryRoutes);
app.use('/category/:id', subCategoryRoutes);
app.use(indexRoutes);
app.use('/category/:id', jobRoutes);
app.use('/blogs', blogRoutes);
app.use(authenticationRoutes);


var csrf_guid = Guid.raw();
var account_kit_api_version = '{{v1.0}}';
var app_id = '{{2008484556034576}}';
var app_secret = '{{ef1f01dfd490c6b74feed73f996fd1d9}}';
var me_endpoint_base_url = 'https://graph.accountkit.com/{{v1.0}}/me';
var token_exchange_base_url = 'https://graph.accountkit.com/{{v1.0}}/access_token';

// =========================================================================================================
app.get('/uploadFile', function(req, res) {
    res.render('uploads', { result: 'result' });
});

app.post('/uploadFile', function(req, res) {
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

app.get('/files', function(req, res) {
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

app.post('/delete_file', function(req, res) {
    var url_del = 'public' + req.body.url_del;
    console.log(url_del);
    if (fs.existsSync(url_del)) {
        fs.unlinkSync(url_del);
    }
    res.redirect('back');
});


function loadLogin() {
    return fs.readFileSync('views/login.html').toString();
}

app.get('/login', function(req, res) {
    var view = {
        appId: app_id,
        csrf: csrf_guid,
        version: account_kit_api_version
    };
    var html = Mustache.to_html(loadLogin(), view);
    res.send(html);
});


function loadLoginSuccess() {
    return fs.readFileSync('dist/login_success.html').toString();
}

app.post('/login_success', function(request, response) {

    // CSRF check
    if (request.body.csrf === csrf_guid) {
        var app_access_token = ['AA', app_id, app_secret].join('|');
        var params = {
            grant_type: 'authorization_code',
            code: request.body.code,
            access_token: app_access_token
        };
        // exchange tokens
        var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
        Request.get({ url: token_exchange_url, json: true }, function(err, resp, respBody) {
            var view = {
                user_access_token: respBody.access_token,
                expires_at: respBody.expires_at,
                user_id: respBody.id
            };

            // get account details at /me endpoint
            var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
            Request.get({ url: me_endpoint_url, json: true }, function(err, resp, respBody) {
                // send login_success.html
                if (respBody.phone) {
                    view.phone_num = respBody.phone.number;
                } else if (respBody.email) {
                    view.email_addr = respBody.email.address;
                }
                var html = Mustache.to_html(loadLoginSuccess(), view);
                response.send(html);
            });
        });
    } else {
        // login failed
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end("Something went wrong. :( ");
    }
});

app.listen(3000, function() {
    console.log("Jobley Is Ready For Your Jobs :).");
});