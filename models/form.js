const mongoose = require('mongoose');
const p = new mongoose.Schema({
    person: {
        type: Object,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("form", p);