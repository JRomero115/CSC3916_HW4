require('dotenv').config();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

//mongoose.connect(process.env.DB, { useNewUrlParser: true });
try {
    mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
//mongoose.set('useCreateIndex', true);

// Movie schema
var MovieSchema = new Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    genre: String,
    actors : [{
        actor1: { type: String, required: true },
        char1: { type: String, required: true },
        actor2: String,
        char2: String,
        actor3: String,
        char3: String
    }]
});

MovieSchema.pre('findOneAndUpdate', function(next) {
    this.getFilter();
    this.getUpdate();
});

MovieSchema.pre('save', function middleware() {
    var movie = this;

    //hash the password
    if (!movie.isModified('title'))
        return next();

    bcrypt.hash(movie.title, null, null, function(err, hash) {
        if (err)
            return next(err);

    });
    next();
});

MovieSchema.methods.compareTitle = function (title, callback) {
    var movie = this;

    bcrypt.compare(title, movie.title, function(err, isMatch) {
        callback(isMatch);
    })
}

//return the model to server
module.exports = mongoose.model('Movie', MovieSchema);