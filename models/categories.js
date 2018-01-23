var mongoose = require('mongoose');
// Category Schema
var categorySchema = new mongoose.Schema({
    title: String,
    image: String,
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});
module.exports = mongoose.model('Category', categorySchema);
