const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// This adds a password and username field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);