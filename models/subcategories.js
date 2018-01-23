var mongoose = require('mongoose');

var subcategorySchema = new mongoose.Schema({
    title: String,
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
});
module.exports = mongoose.model('SubCategory', subcategorySchema);