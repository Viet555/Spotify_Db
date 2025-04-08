const express = require('express');
const mongoose = require('mongoose');
const User = require('../Model/User');
const AllCode = require('../Model/AllCode');
const Artist = require('../Model/Artist')
const Episode = require('../Model/Episode')
const Podcasts = require('../Model/Podcasts');
const Library = require('../Model/Library');
const Playlist = require('../Model/Playlist');
const Song = require('../Model/Song');
const FavoriteSong = require('../Model/FavoriteSong');

connection = mongoose.connect('mongodb://localhost:27017/spotify', {

})
    .then(() => console.log('Connected to MongoDB Success'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


module.exports = { connection, User, AllCode, Artist, Episode, Podcasts, Library, Playlist, Song, FavoriteSong };
