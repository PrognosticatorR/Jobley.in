var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');
var compression = require('compression');
var express = require('express');
var dotenv = require('dotenv').config();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var session = require('express-session');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var flash = require('connect-flash');
var Guid = require('guid');
var Mustache = require('mustache');
var Request = require('request');
var Querystring = require('querystring');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

var Category = require('./models/categories');
var Job = require('./models/jobs');
var SubCategory = require('./models/subcategories');
var Blog = require('./models/blogs');
var User = require('./models/users');
var shortCat = require('./models/shortCat');

var config = require('./config/config');

var admitCardRoutes = require('./routes/admit&result');
var categoryRoutes = require('./routes/categories');
var subCategoryRoutes = require('./routes/subcategories');
var blogRoutes = require('./routes/blogs');
var authenticationRoutes = require('./routes/authentication');
var jobRoutes = require('./routes/jobs');
var indexRoutes = require('./routes/index');
var admitCardRoutes = require('./routes/admit&result');

var isDev = process.env.NODE_ENV !== 'production';
var port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost/AnswerMachin', { useMongoClient: true });
// mongoose.connect(isDev ? config.db_dev : config.db, {
//     useMongoClient: true,
// });
mongoose.Promise = global.Promise;

var app = express();
app.use(compression());
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({
    secret: 'seeeionsecrete',
    saveUninitialized: false,
    resave: false
}));
app.use(require('express-session')({
    secret: 'expresssessionsecrete',
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
app.use(helmet());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(categoryRoutes);
app.use('/category/:cat_title', subCategoryRoutes);
app.use(indexRoutes);
app.use('/category/:cat_title', jobRoutes);
app.use('/blogs', blogRoutes);
app.use(authenticationRoutes);
app.use(admitCardRoutes);

app.listen(port, '0.0.0.0', function(req, res, err) {
    if (err) {
        console.log(err);
    }
    console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
});