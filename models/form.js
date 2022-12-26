const mongoose = require('mongoose');
const p = new mongoose.Schema({
    fullname: {
        type: String,
        //required: true
    },
    code: {
        type: String,
        //required: true
    },
    interest: {
        type: String,
        //required: true
    },
    phonenumber: {
        type: Number,
        //required: true
    },
    location: {
        type: String,
        //required: true
    },
    date: {
        type: String,
        //required: true
    },
    Timestart: {
        type: Number,
        //required: true
    },
    Timefinish: {
        type: Number,
        //required: true
    },
    likes1: {
        type: Boolean,
        //required: true
    },
    likes2: {
        type: Boolean,
        //required: true
    },
    likes3: {
        type: Boolean,
        //required: true
    }
});

module.exports = mongoose.model("form", p);