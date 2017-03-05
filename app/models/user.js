// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    person_id : Number,
    gender:     String,
    age:        Number
});

module.exports = mongoose.model('User', UserSchema);
