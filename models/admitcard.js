var mongoose = require('mongoose');
var admitSchema = new mongoose.Schema({
    title: String,
    category: String,
    created: { type: Date, default: Date.now },
    download: String
});
module.exports = mongoose.model('Admit', admitSchema);