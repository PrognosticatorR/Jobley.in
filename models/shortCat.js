var mongoose = require('mongoose');

var shortCatSchema = new mongoose.Schema({
    title: String,
    admits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admit'
    }]
});
module.exports = mongoose.model('ShortCat', shortCatSchema);