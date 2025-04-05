const mongoose = require('mongoose');

const AllcodeSchema = new mongoose.Schema({
    allCodeInfo: {
        name: String,
        keyMap: String
    },
});

const AllCode = mongoose.model('AllCode', AllcodeSchema);
module.exports = AllCode;
