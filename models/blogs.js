var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    image: String,
    title: String,
    body: String,
    created: { type: Date, default: Date.now },
    subheader: String,
    username: String
});
module.exports = mongoose.model('Blog', blogSchema);
