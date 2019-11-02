const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    thumbnail:String,
    item:String,
    describe:String,
    techStack:String,
    approve:String
});

const User = mongoose.model('user', userSchema);

module.exports = User;
