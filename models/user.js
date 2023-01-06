const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const u = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("user", u);

module.exports.createUser = async (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash
            newUser.save(callback)
        })
    })
}
module.exports.getUserByUsername = async (username, callback) => {
    var query = { username: username }
    User.findOne(query, callback)
}
module.exports.getUserById = async (id, callback) => {
    User.findById(id, callback)
}
module.exports.comparePassword = async (candidatePassword, hash,callback) => {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err
      callback(null, isMatch)
    });
}