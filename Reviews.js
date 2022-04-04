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

module.exports = mongoose.model('Review', ReviewSchema);