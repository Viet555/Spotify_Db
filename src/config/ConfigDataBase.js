const express = require('express');
const mongoose = require('mongoose');
const User = require('../Model/User');
const AllCode = require('../Model/AllCode');



connection = mongoose.connect('mongodb://localhost:27017/spotify', {

})
    .then(() => console.log('Connected to MongoDB Success'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


module.exports = { connection, User, AllCode, };
