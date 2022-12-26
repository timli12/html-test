const mongoose = require('mongoose');
const p = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    identity: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stime: {
        type: Number,
        required: true
    },
    etime: {
        type: Number,
        required: true
    },
    cook: {
        type: Boolean,
        required: true
    },
    bath: {
        type: Boolean,
        required: true
    },
    clean: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("form", p);