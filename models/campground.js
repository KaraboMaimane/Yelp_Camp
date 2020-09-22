const mongoose = require('mongoose');

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    //we are making a reference to the comments on the campground context and not embedding it
    comments: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", campgroundSchema);
