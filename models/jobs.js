var mongoose = require('mongoose');
// Job Schema
var jobSchema = new mongoose.Schema({
    eligibility: String,
    category: String,
    department: String,
    subcategory: String,
    created: { type: Date, default: Date.now },
    lastDate: String,
    jobLocation: String,
    title: String,
    experience: String,
    applyNow: String,
    pdfUrl:String,
    jobDetails: String,
    description: String,
    hiringProcess: String,
    jobRole: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model('Job', jobSchema);
