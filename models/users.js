var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
        username: {
            type: String,
            index: {
                unique: true
            }
        },
        password: {
            type: String,
            required: true,
            match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
            minlength: 8
        },
        email: {
            type: String,
            require: true,
            match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        },
        created: {
            type: Date,
            required: true,
            default: new Date()
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }]
    });

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);
module.exports = User;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
