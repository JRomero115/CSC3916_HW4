require('dotenv').config();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

try {
    mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}

// Review schema
var ReviewSchema = new Schema({
    nameReview: { type: String, required: true },
    quote : String,
    rating: { type: Number, required: true }
});

ReviewSchema.pre('save', function(next) {
    var review = this;

    //hash the password
    if (!review.isModified('title'))
        return next();

    bcrypt.hash(review.title, null, null, function(err, hash) {
        if (err)
            return next(err);

    });
    next();
});

ReviewSchema.methods.compareTitle = function (title, callback) {
    var review = this;

    bcrypt.compare(title, review.title, function(err, isMatch) {
        callback(isMatch);
    })
}

module.exports = mongoose.model('Review', ReviewSchema);